import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas5 extends Tragamonedas {

  constructor() {
    super(5, 5, ["🍇", "🍉", "🍒", "🍎", "🍑", "🍋", "🍓", "🥝", "🍌"]);
  }

  pagar(apuesta: number): void {
    throw new Error("Method not implemented.");
  }
}