import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas5 extends Tragamonedas {
  private static figuras: string[] = ["🍇", "🍉", "🍒", "🍎", "🍑", "🍋", "🍓", "🥝", "🍌"];

  constructor() {
    super(5, 5, Tragamonedas5.figuras, 50);
  }

  pagar(apuesta: number): void {
    throw new Error("Method not implemented.");
  }
}