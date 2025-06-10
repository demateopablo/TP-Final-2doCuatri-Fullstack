import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas3 extends Tragamonedas {
  private mu: number;
  private sigma: number;
  private atenuador: number;
  private static figuras: string[] = ["♠️ ", "♦️ ", "♥️ ", "♣️ ", "🎲", "⭐"];

  constructor() {
    super(3, 3, Tragamonedas3.figuras);
    this.mu = (this.cantLineas + 1) / 2; //Mu: el número de la línea central
    this.sigma = (this.cantLineas + 3 - Math.ceil(this.cantRodillos / this.cantLineas)) / 10; //Sigma: hace que el peso baje más o menos rápido cuando te alejás del centro
    this.atenuador = (this.cantLineas * 2 / this.cantRodillos) //Atenuador: equilibra la ganancia segun cant de lineas (divisor para bajar el premio final)
  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    const PESOS: number = super.pedirApuesta();
    if (PESOS < this.apuestaMin) return; //no tiene saldo
    let cantTiradasPosibles: number = Math.floor(PESOS / this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles);
    console.log(`\n--------------------------------------\nSu saldo actual es de ${this.jugador.getMonedero()}\n--------------------------------------\n`);
  }

  private menuCantGiros(cantTiradasPosibles: number) {
    let opcGiros: number;
    do {
      opcGiros = rdl.questionInt(`Jugadas disponibles:\n\t1 - Girar una vez\n\t2 - Girar ${cantTiradasPosibles} veces\n\t0 - Retirarse\nIngrese la opcion deseada: `);
    } while (opcGiros < 0 || opcGiros > 2)
    this.opcCantGiros(opcGiros, cantTiradasPosibles)
  }

  private opcCantGiros(opc: number, cantTiradasPosibles: number): void {
    let multiplicadorGanancia: number = 0;
    switch (opc) {
      case 1:
        super.jugar(this.jugador);
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
          super.jugar(this.jugador);
          multiplicadorGanancia += this.verSiGana();
        }
        if (multiplicadorGanancia > 0) this.pagar(this.apuestaMin * multiplicadorGanancia);
        break;
      default: // 0
        this.jugador.modificarSaldo(cantTiradasPosibles * this.apuestaMin);
        console.log(`Usted se ha retirado del juego.\n\t→ El dinero restante se ha devuelto a su monedero. Saldo actual: $${this.jugador.getMonedero()}`);
        return;
    }
  }

  private verificarFila(lin: number): boolean {
    let match: boolean = true;
    let valor: string = this.matrizRodillos[lin][0];
    let i: number = 1;
    while (match && i < this.cantRodillos) {
      match = (this.matrizRodillos[lin][i] === valor);
      i++;
    }
    return match;
  }

  private verSiGana(): number {
    let multiplicadorGanancia: number = 0;
    let gauss: number = 0;
    for (let i = 0; i < this.cantLineas; i++) {
      if (this.verificarFila(i)) {
        console.log(`Coincidencia en linea ${i + 1}`);
        gauss = this.calcularGananciaPorLinea(i + 1);
        multiplicadorGanancia += gauss
      }
    }
    if (multiplicadorGanancia === 0) return 0;
    return multiplicadorGanancia;
  }

  private calcularGananciaPorLinea(linea: number): number {
    const peso = this.gaussiana(linea, this.mu, this.sigma);
    const escalado = peso * 100;
    return Math.ceil(escalado / this.atenuador);
  }

  pagar(apuesta: number): void {
    this.jugador.modificarSaldo(apuesta);
    console.log(`✅ Se te acreditaron $${apuesta} en tu monedero.`)
  }
}