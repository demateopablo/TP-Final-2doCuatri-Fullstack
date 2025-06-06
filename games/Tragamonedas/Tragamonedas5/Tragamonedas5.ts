import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas5 extends Tragamonedas {

  constructor() {
    super(5, 5, ["1️⃣", "2️⃣", "3️⃣", "4️⃣"]);
  }

  pagar(apuesta: number, jugador: Jugador): void {
    throw new Error("Method not implemented.");
  }
}