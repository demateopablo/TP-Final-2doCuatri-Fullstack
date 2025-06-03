import { generadorNumeroAleatorio } from "../../generadorNumeroAleatorio";
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";

export class Tragamonedas extends Juego {
  protected rodillo: string[];
  protected cantRodillos: number;
  protected nrosAleatorios: generadorNumeroAleatorio;

  constructor(cantRodillos: number, rodillo: string[]) {
    super("Tragamonedas", 500)
    this.rodillo = rodillo;
    this.cantRodillos = cantRodillos;
    this.nrosAleatorios = new generadorNumeroAleatorio(0, rodillo.length - 1)
    // this.agregarRodillos(rodillo);
  }

  // agregarRodillos(rodillo: string[]): void {
  //   for (let i = 0; i < this.rodillos.length; i++) {
  //     this.rodillos.push(rodillo)
  //   }
  // }

  jugar(jugador: Jugador): void {
    //logica
  };

  pagar(apuesta: number, jugador: Jugador): void {
    //logica
  };
}