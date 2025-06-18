import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";
import { GeneradorNumeroAleatorio } from "../../servicios/GeneradorNumeroAleatorio";
import * as rdl from 'readline-sync';

export class Ruleta extends Juego {
  private static MIN: number = 0;
  private static MAX: number = 36;
  private ficha: number[];
  private valorFicha: number;
  private conjuntoRojo: number[];
  private conjuntoNegro: number[];
  private rojo: string;
  private negro: string;
  private ruleta: number[];
  private pagoPleno: number;
  private pagoColor: number;
  private pagoDosAUno: number;
  private opcion: GeneradorNumeroAleatorio;
  private conjuntoDePlenos: number[];
  private cantFichas: number;

  constructor() {

    super("Ruleta", 1000);
    this.ficha = [1000, 2000, 5000, 10000];
    this.valorFicha = 0;
    this.conjuntoRojo = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    this.conjuntoNegro = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    this.rojo = '🔴';
    this.negro = `⚫`;
    this.ruleta = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    this.pagoPleno = 35;
    this.pagoColor = 1;
    this.pagoDosAUno = 2;
    this.opcion = new GeneradorNumeroAleatorio(Ruleta.MIN, Ruleta.MAX);
    this.conjuntoDePlenos = new Array();
    this.cantFichas = 0;

  }

  mostrarFichas(): void {
    for (let i = 0; i < this.ficha.length; i++) {
      console.log(`Ficha ${i + 1}: ${this.ficha[i]}`);
    }

  }

  mostrarPaño(): void {
    console.log(`${this.ruleta.sort((a, b) => a - b)}`);//observar
    console.log(`Rojo: ${this.rojo} ${this.conjuntoRojo}`);
    console.log(`Negro: ${this.negro} ${this.conjuntoNegro}`);
  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador;
    let apuesta: number = rdl.questionInt(`Cuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`);
    if (super.leAlcanzaParaJugar(this.jugador.getMonedero())) {
      let opcion: number;
      do {
        this.mostrarFichas();
        opcion = rdl.questionInt(`Elija una ficha: `);
        if (apuesta >= this.ficha[opcion - 1]) {
          this.valorFicha = this.ficha[opcion - 1];
        } else {
          console.log(`\nEl número no es válido o el valor de la apuesta no alcanza para la ficha seleccionada.\n`);
          this.jugar(jugador);
        }
      } while (opcion < 1 || opcion > 4)
      this.DevolverResto(apuesta);
      this.calcularFichas(apuesta);
      while (this.cantFichas > 0) {
        this.mostrarPaño();
        let numApuesta: number;
        do {
          this.opcionesDeApuesta();
          numApuesta = rdl.questionInt(`A que desea apostar?`);
        } while (numApuesta < 1 || numApuesta > 8)
        let numAzar: number;
        let fichaUnica: number = 1;
        switch (numApuesta) {
          case 1: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            let restoPar: number = 0;
            if (this.compararParesImpares(numAzar) === restoPar) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 2: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            let restoImpar: number = 1;
            if (this.compararParesImpares(numAzar) === restoImpar) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 3: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            if (this.compararNumeros(this.conjuntoRojo, numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 4: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);

            if (this.compararNumeros(this.conjuntoNegro, numAzar)) {
              this.pagar(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 5: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            if (numAzar > 0 && numAzar < 13) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 6: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            if (numAzar > 12 && numAzar < 25) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          case 7: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.descontarSaldoPorFicha(fichaUnica);
            if (numAzar > 24 && numAzar < 36) {
              this.pagarDocena(this.valorFicha);
              this.imprimirGanador(numAzar);
            } else {
              this.imprimirPerdedor(numAzar);
            }
            break;
          default: this.cantFichas -= fichaUnica;
            numAzar = this.opcion.generarNumeroAleatorio();
            this.elegirNumeroDePlenos(this.conjuntoDePlenos);
            this.descontarSaldoPorFicha(this.conjuntoDePlenos.length);
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

  private calcularFichas(apuesta: number): number {
    this.cantFichas = Math.floor(apuesta / this.valorFicha);
    return this.cantFichas;
  }

  private DevolverResto(apuesta: number): void {
    let sobrante: number = apuesta % this.valorFicha;
    this.jugador.modificarSaldo(this.jugador.getMonedero() + sobrante);
  }

  private descontarSaldoPorFicha(cantNums: number): void {
    let totalApostado = this.valorFicha * cantNums;
    this.jugador.modificarSaldo(-totalApostado);
  }

  private imprimirGanador(numAzar: number): void {
    console.log(`\nGanaste con el numero ${numAzar}\n`);
    console.log(this.cantFichas);
  }

  private imprimirPerdedor(numAzar: number): void {
    console.log(`\nPerdiste, el número es: ${numAzar}\n`);
    console.log(this.cantFichas);
  }

  private opcionesDeApuesta(): void {
    console.log(`1. Pares`);
    console.log(`2. Impares`);
    console.log(`3. Rojos`);
    console.log(`4. Negros`);
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

  private elegirNumeroDePlenos(conjuntoDePlenos: number[]): void {
    let cantNumeros: number = rdl.questionInt(`\nA cuantos numeros desea apostar?\n`);
    if (((this.valorFicha * cantNumeros) <= this.jugador.getMonedero())) {
      let numElegido: number;
      do {
        numElegido = rdl.questionInt(`\nElija el siguiente numero a apostar\n`);
        conjuntoDePlenos.push(numElegido);
      } while (conjuntoDePlenos.length != cantNumeros)
    } else {
      console.log(`\nNo posee el dinero suficiente para apostar a esa cantidad de numeros\n`);
      this.elegirNumeroDePlenos(conjuntoDePlenos);
    }
  }

  private compararParesImpares(numAzar: number): number {
    let resto = numAzar % 2;
    return resto;
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