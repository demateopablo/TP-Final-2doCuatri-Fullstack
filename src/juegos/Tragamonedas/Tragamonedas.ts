import * as rdl from 'readline-sync';
import { GeneradorNumeroAleatorio } from "../../servicios/GeneradorNumeroAleatorio";
import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";
import { OpcionInvalidaError, SaldoInsuficienteError } from '../../sistema/errores/ErroresPersonalizados';
import { colores } from "../../sistema/configColores";

export abstract class Tragamonedas extends Juego {
  protected rodillo: string[];
  protected matrizRodillos: string[][] = [];
  protected cantRodillos: number;
  protected cantLineas: number;
  protected nrosAleatorios: GeneradorNumeroAleatorio;
  protected mu!: number;
  protected sigma!: number;
  protected atenuador!: number;
  private gananciaDiagonal: number = 100;
  private gananciaCentral: number = 2;


  constructor(cantRodillos: number, cantLineas: number, rodillo: string[], apuestaMinima: number) {
    super(`Tragamonedas ${cantRodillos}`, apuestaMinima);
    this.rodillo = rodillo;
    this.crearMatriz(cantRodillos, cantLineas);
    this.cantRodillos = cantRodillos;
    this.cantLineas = cantLineas;
    this.nrosAleatorios = new GeneradorNumeroAleatorio(0, rodillo.length - 1);
  }

  private crearMatriz(rod: number, lin: number) {
    for (let i = 0; i < lin; i++) {
      this.matrizRodillos[i] = [];
      for (let j = 0; j < rod; j++) {
        this.matrizRodillos[i][j] = '';
      }
    }
  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    const PESOS: number = this.pedirApuesta();
    if (PESOS < this.apuestaMin) return; //no tiene saldo
    let cantTiradasPosibles: number = Math.floor(PESOS / this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles);
    console.log(`\n--------------------------------------\nSu saldo actual es de ${this.jugador.getMonedero()}\n--------------------------------------\n`);
  }

  protected pedirApuesta(): number {
    try {
      if (super.jugadorApto(this.jugador.getMonedero(), this.apuestaMin)) {
        const maxCantGiros: number = Math.floor(this.jugador.getMonedero() / this.apuestaMin);
        let apuesta: number;
        do {
          apuesta = rdl.questionInt(`\nCuantas tiradas deseas jugar? (cada giro cuesta $${this.apuestaMin} y tiene saldo para ${maxCantGiros} giros como maximo): `);
        }
        while (apuesta < 1 || apuesta > maxCantGiros)
        apuesta *= this.apuestaMin; //convertimos la cantidad de tiradas en el consumo total que hara en la jugada
        this.jugador.modificarSaldo((-1) * apuesta);
        return apuesta
      } else {
        throw new SaldoInsuficienteError();
      }
    } catch (error) {
      console.error((error as SaldoInsuficienteError).message);
      return 0;
    }
  }

  // Gira los rodillos de la tragamonedas y llena la matriz con los valores aleatorios
  private girarRodillos(): void {
    let indice: number;
    for (let i = 0; i < this.cantLineas; i++) {
      for (let j = 0; j < this.cantRodillos; j++) {
        indice = this.nrosAleatorios.generarNumeroAleatorio();
        this.matrizRodillos[i][j] = this.rodillo[indice];
      }
    }
  }

  // Muestra la matriz de rodillos en la consola
  protected mostrarEnConsola(): void {
    let matrizToString: string = '\n';
    for (let i = 0; i < this.cantLineas; i++) {
      matrizToString += `Linea ${i + 1}: | `;
      for (let j = 0; j < this.cantRodillos; j++) {
        matrizToString += ` ${this.matrizRodillos[i][j]} | `;
      }
      matrizToString += "\n";
    }
    console.log(`${matrizToString} `);
  }

  protected gaussiana(x: number, mu: number, sigma: number): number {
    const coef = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coef * Math.exp(exponent);
  }

  protected verificarFila(lin: number): boolean {
    let match: boolean = true;
    let valor: string = this.matrizRodillos[lin][0];
    let i: number = 1;
    while (match && i < this.cantRodillos) {
      match = (this.matrizRodillos[lin][i] === valor);
      i++;
    }
    return match;
  }

  protected verSiGana(): number {
    let multiplicadorGanancia: number = 0;
    let gauss: number = 0;
    for (let i = 0; i < this.cantLineas; i++) {
      if (this.verificarFila(i)) {
        gauss = this.calcularGananciaPorLinea(i + 1);
        if ((Math.floor((this.cantLineas + 1) / 2)) === (i+1)) { //cantLineas / 2 es igual a la posicion del medio en el arreglo
          console.log(`Coincidencia en linea central`);
          multiplicadorGanancia += gauss * this.gananciaCentral;
        } else {
          console.log(`Coincidencia en linea ${i + 1} `);
          multiplicadorGanancia += gauss
        }
      }
    }
    if (this.cantLineas === this.cantRodillos) { //es matriz cuadrada
      if (this.verificarDiagonalPrimaria()) {
        multiplicadorGanancia += this.gananciaDiagonal;
      }
      if (this.verificarDiagonalSecundaria()) {
        multiplicadorGanancia += this.gananciaDiagonal;
      }

    }
    if (multiplicadorGanancia === 0) return 0;
    return multiplicadorGanancia;
  }

  private verificarDiagonalPrimaria(): boolean {
    let match: boolean = true;
    let valor: string = this.matrizRodillos[0][0];
    let i: number = 1;
    while (match && i < this.cantRodillos) {
      match = (this.matrizRodillos[i][i] === valor);
      i++;
    }
    if (match) console.log(`Coincidencia en diagonal primaria!`)
    return match;
  }

  private verificarDiagonalSecundaria(): boolean {
    let match: boolean = true;
    let limite: number = this.cantRodillos - 1;
    let valor: string = this.matrizRodillos[limite][0];
    let i: number = 1;
    limite -= 1;
    while (match && i < this.cantRodillos) {
      match = (this.matrizRodillos[limite][i] === valor);
      i++;
      limite--;
    }
    if (match) console.log(`Coincidencia en diagonal secundaria!`)
    return match;
  }


  protected menuCantGiros(cantTiradasPosibles: number): void {
    let opcGiros: number=-1;
    do {
      try {
        opcGiros = rdl.questionInt(`Jugadas disponibles: \n\t1 - Girar una vez\n\t2 - Girar ${cantTiradasPosibles} veces\n\t0 - Retirarse\nIngrese la opcion deseada: `);
        if (opcGiros < 0 || opcGiros > 2) {
          throw new OpcionInvalidaError;
        }
      } catch (error) {
        console.error((error as OpcionInvalidaError).message);
      }
    } while (opcGiros < 0 || opcGiros > 2)
    this.opcCantGiros(opcGiros, cantTiradasPosibles)
  }

  protected opcCantGiros(opc: number, cantTiradasPosibles: number): void {
    let multiplicadorGanancia: number = 0;
    switch (opc) {
      case 1:
        this.girarRodillos();
        this.mostrarEnConsola();
        multiplicadorGanancia = this.verSiGana();
        if (multiplicadorGanancia > 0) {
          this.pagar(this.apuestaMin * multiplicadorGanancia);
        }
        cantTiradasPosibles--;
        console.log(`------- Giros restantes: ${cantTiradasPosibles} -------\n`);
        if (cantTiradasPosibles > 0) {
          this.menuCantGiros(cantTiradasPosibles);
        }
        break;
      case 2:
        for (let i = 0; i < cantTiradasPosibles; i++) {
          this.girarRodillos();
          this.mostrarEnConsola();
          multiplicadorGanancia += this.verSiGana();
        }
        if (multiplicadorGanancia > 0) this.pagar(this.apuestaMin * multiplicadorGanancia);
        break;
      default: // 0
        this.jugador.modificarSaldo(cantTiradasPosibles * this.apuestaMin);
        console.log(`${colores.salir}Usted se ha retirado del juego.\n\t→ El dinero restante se ha devuelto a su monedero. Saldo actual: ${colores.saldoPositivoSinFondo} $${this.jugador.getMonedero()} ${colores.neutro}`);
        return;
    }
  }

  private calcularGananciaPorLinea(linea: number): number {
    const peso = this.gaussiana(linea, this.mu, this.sigma);
    const escalado = peso * 100;
    return Math.ceil(escalado / this.atenuador);
  }


  abstract pagar(apuesta: number): void
}
