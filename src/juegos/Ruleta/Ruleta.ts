import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";
import { GeneradorNumeroAleatorio } from "../../servicios/GeneradorNumeroAleatorio";
import * as rdl from 'readline-sync';
import { OpcionInvalidaError, SaldoInsuficienteError } from '../../sistema/errores/ErroresPersonalizados';

export class Ruleta extends Juego {
  private MIN: number = 0;
  private MAX: number = 36;
  private ficha: number[];
  private valorFicha: number;
  private conjuntoRojo: number[];
  private conjuntoNegro: number[];
  private rojo: string;
  private negro: string;
  private pagoPleno: number;
  private pagoColor: number;
  private pagoDosAUno: number;
  private opcion: GeneradorNumeroAleatorio;
  private conjuntoDePlenos: number[];
  private cantFichas: number;
  private fichaUnica: number;

  constructor() {

    super("Ruleta", 1000);
    this.ficha = [1000, 2000, 5000, 10000];
    this.valorFicha = 0;
    this.conjuntoRojo = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    this.conjuntoNegro = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    this.rojo = '🔴';
    this.negro = `⚫`; 
    this.pagoPleno = 35;
    this.pagoColor = 1;
    this.pagoDosAUno = 2;
    this.opcion = new GeneradorNumeroAleatorio(this.MIN, this.MAX);
    this.conjuntoDePlenos = new Array();
    this.cantFichas = 0;
    this.fichaUnica = 1;

  }

  private mostrarFichas(): void {
    for (let i = 0; i < this.ficha.length; i++) {
      console.log(`Ficha ${i + 1}: ${this.ficha[i]}`);
    }

  }

  private generarFila(filaNum: number): void {
    let fila: string = ``;

    for (let col = 0; col < 3; col++) {
      const numero: number = filaNum * 3 + col + 1;
      // /*filaNum * 3 avanza en bloques de 3 números según la fila.
      //col suma la posición dentro de esa fila (0 a 2).
      //+ 1 ajusta para que los números empiecen en 1, no en 0.*/
      const color: string = this.obtenerColor(numero);
      fila += `[${color}${(numero).toString().padStart(2, ` `)}]`;
    }

    console.log(fila);
  }

  private obtenerColor(numero: number): string {
    if (this.conjuntoRojo.includes(numero)) return this.rojo;
    if (this.conjuntoNegro.includes(numero)) return this.negro;
    return '';
  }

  private mostrarPaño(): void {
    console.log(`\n======= PAÑO DE RULETA (ESTILO MESA CASINO) =======\n`);
    console.log(`[       🟢0      ]`);
    for (let fila = 0; fila < 12; fila++) {
      this.generarFila(fila);
    }
  }

  private jugadorValido(apuesta: number): boolean {
    try {
      if (super.jugadorApto(this.jugador.getMonedero(), apuesta)) return true;
      else throw new SaldoInsuficienteError();

    } catch (error) {
      console.error(`${(error as SaldoInsuficienteError).message}\n`);
      return false;
    }
  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador;
    let apuesta: number = rdl.questionInt(`Cuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`);
    if (this.jugadorValido(apuesta) && this.leAlcanzaParaJugar(apuesta)) {
      let opcion: number;
      do {
        this.mostrarFichas();
        opcion = rdl.questionInt(`Elija una ficha: `);
        try {
          if (opcion < 1 || opcion > 4) throw new OpcionInvalidaError()
          else if (apuesta < this.ficha[opcion - 1]) throw new SaldoInsuficienteError();
          this.valorFicha = this.ficha[opcion - 1];
        } catch (error) {
          if (error instanceof OpcionInvalidaError) {
            console.error(`${(error as OpcionInvalidaError).message}\n`);
          }
          else {
            console.error(`${(error as SaldoInsuficienteError).message}\n`);
          }
        }
      } while (opcion < 1 || opcion > 4 || apuesta < this.ficha[opcion - 1])
      this.devolverResto(apuesta);
      this.calcularFichas(apuesta);
      while (this.cantFichas > 0) {
        this.mostrarPaño();
        let numApuesta: number;
        do {
          this.opcionesDeApuesta();
          numApuesta = rdl.questionInt(`A que desea apostar? `);
        } while (numApuesta < 1 || numApuesta > 8)
        let numAzar: number = this.opcion.generarNumeroAleatorio();
        switch (numApuesta) {
          case 1: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (this.esPar(numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 2: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (!this.esPar(numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 3: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (this.compararNumeros(this.conjuntoRojo, numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 4: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (this.compararNumeros(this.conjuntoNegro, numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 5: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (numAzar > 0 && numAzar < 13) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 6: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (numAzar > 12 && numAzar < 25) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 7: this.descontarFicha(this.fichaUnica);
            this.descontarSaldoPorFicha(this.fichaUnica);
            if (numAzar > 24 && numAzar < 36) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          default:
            this.conjuntoDePlenos = [];
            this.elegirNumeroDePlenos(this.conjuntoDePlenos, this.cantFichas);
            this.descontarSaldoPorFicha(this.conjuntoDePlenos.length);
            this.descontarFicha(this.conjuntoDePlenos.length)
            const repeticiones = this.controlDeRepeticiones(this.conjuntoDePlenos, numAzar);
            if (repeticiones > 0) {
              this.pagarPleno(this.valorFicha * repeticiones);
              this.imprimirGanador(numAzar);
              console.log(`Cantidad de veces que se aposto a este numero ${repeticiones}\n`);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
        }
      }

    }
  }

  private descontarFicha(fichaNum: number): number {
    return this.cantFichas -= fichaNum;
  }

  private calcularFichas(apuesta: number): number {
    this.cantFichas = Math.floor(apuesta / this.valorFicha);
    return this.cantFichas;
  }

  private devolverResto(apuesta: number): void {
    let sobrante: number = apuesta % this.valorFicha;
    this.jugador.modificarSaldo(sobrante);
  }

  private descontarSaldoPorFicha(cantNums: number): void {
    let totalApostado = this.valorFicha * cantNums;
    this.jugador.modificarSaldo(-totalApostado);
  }

  private imprimirGanador(numAzar: number): void {
    console.log(`\nGanaste con el numero ${numAzar}`);
    console.log(this.jugador.monederoToString());
    console.log(`\nQuedan ${this.cantFichas} fichas para usar.`);
  }

  private imprimirPerdedor(numAzar: number): void {
    console.log(`\nPerdiste, el número es: ${numAzar}`);
    console.log(this.jugador.monederoToString());
    console.log(`\nQuedan ${this.cantFichas} fichas para usar.`);
  }

  private opcionesDeApuesta(): void {
    console.log(`\n1. Pares`);
    console.log(`2. Impares`);
    console.log(`3. 🔴 Rojo`);
    console.log(`4. ⚫ Negro`);
    console.log(`5. 1° Docena`);
    console.log(`6. 2° Docena`);
    console.log(`7. 3° Docena`);
    console.log(`8. Pleno (numero concreto)`);
  }

  private controlDeRepeticiones(conjuntoDePlenos: number[], numAzar: number): number {
    let contador = 0;
    conjuntoDePlenos.forEach(num => {
      if (num === numAzar) {
        contador++;
      }
    });
    return contador;
  }

  private elegirNumeroDePlenos(conjuntoDePlenos: number[], cantFichas: number, cantNumeros: number = 0): void {
    cantNumeros <= 0 || cantNumeros > cantFichas ? cantNumeros = rdl.questionInt(`\nA cuantos numeros desea apostar?\n`):"";
    try {
      if (((cantNumeros > 0 && this.valorFicha * cantNumeros <= this.jugador.getMonedero() && cantNumeros <= cantFichas))) {
        let numElegido: number;
        do {
          numElegido = rdl.questionInt(`\nElija el siguiente numero a apostar\n`);
          if (numElegido >= this.MIN && numElegido <= this.MAX) conjuntoDePlenos.push(numElegido);
          else throw new OpcionInvalidaError();
        } while (conjuntoDePlenos.length < cantNumeros)
      } else {
        throw new SaldoInsuficienteError();
      }
    } catch (error) {
      if (error instanceof SaldoInsuficienteError) {
        console.error(`${(error as SaldoInsuficienteError).message}\n`);
        this.elegirNumeroDePlenos(conjuntoDePlenos, cantFichas, 0);
      } else {
        console.error(`${(error as OpcionInvalidaError).message}\n`);
        this.elegirNumeroDePlenos(conjuntoDePlenos, cantFichas, cantNumeros);
      }
    }
  }

  private esPar(numAzar: number): boolean {
    return numAzar % 2 === 0;
  }

  private compararNumeros(arr: number[], numAleatorio: number): boolean {
    return arr.includes(numAleatorio);
  }

  pagar(valorFicha: number): void {
    this.jugador.modificarSaldo((this.valorFicha * this.pagoColor) + valorFicha);
  }

  private pagarDocena(valorFicha: number): void {
    this.jugador.modificarSaldo((valorFicha * this.pagoDosAUno) + valorFicha);
  }

  private pagarPleno(valorFicha: number): void {
    this.jugador.modificarSaldo((valorFicha * this.pagoPleno));
  }
}