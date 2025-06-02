import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";

export class Tragamonedas extends Juego {
  private rodillos: string[][];

  constructor(cantRodillos: number, rodillo: string[]) {
    super("Tragamonedas", 500)
    this.rodillos = new Array(cantRodillos);
    this.agregarRodillos(rodillo);
  }

  agregarRodillos(rodillo: string[]): void {
    for (let i = 0; i < this.rodillos.length; i++) {
      this.rodillos.push(rodillo)
    }
  }

  jugar(jugador: Jugador): void {
    //logica
  };

  pagar(apuesta: number, jugador: Jugador): void {
    //logica
  };
}