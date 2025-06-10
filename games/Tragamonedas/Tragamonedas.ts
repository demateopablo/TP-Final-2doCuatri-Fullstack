import * as rdl from 'readline-sync';
import { GeneradorNumeroAleatorio } from "../../GeneradorNumeroAleatorio";
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";

export abstract class Tragamonedas extends Juego {
  protected rodillo: string[];
  protected matrizRodillos: string[][] = [];
  protected cantRodillos: number;
  protected cantLineas: number;
  protected nrosAleatorios: GeneradorNumeroAleatorio;
  protected jugador!: Jugador; //se inicializa vacio y se asigna valor al jugar

  constructor(cantRodillos: number, cantLineas: number, rodillo: string[]) {
    super(`Tragamonedas ${cantRodillos}`, 50);
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

  jugar(jugador:Jugador): void {
    this.girarRodillos();
    this.mostrarEnConsola();
  }

  protected pedirApuesta(): number {
    let apuesta: number = rdl.questionInt(`\nCuantas tiradas deseas jugar? (cada giro cuesta $${this.apuestaMin}): `) * this.apuestaMin;
    if (super.jugadorApto(this.jugador.getMonedero(), apuesta)) {
      if (this.leAlcanzaParaJugar(apuesta)) {
        this.jugador.modificarSaldo((-1) * apuesta);
        return apuesta
      } else {
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.pedirApuesta();
      }
    } else {
      console.log("No posee dinero suficiente.");
      return 0;
    }
    return this.jugador.getMonedero();
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
  private mostrarEnConsola(): void {
    let matrizToString: string = '\n';
    for (let i = 0; i < this.cantLineas; i++) {
      matrizToString += `Linea ${i + 1}: |`;
      for (let j = 0; j < this.cantRodillos; j++) {
        matrizToString += ` ${this.matrizRodillos[i][j]} |`;
      }
      matrizToString += "\n";
    }
    console.log(`${matrizToString}`);
  }

  protected gaussiana(x: number, mu: number, sigma: number): number {
    const coef = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    return coef * Math.exp(exponent);
  }

  abstract pagar(apuesta: number): void
}
