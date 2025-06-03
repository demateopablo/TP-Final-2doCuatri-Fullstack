import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    super(3, ["🛩️", "♦️", "♥️", "👍", "🤩"]);
  }

  jugar(jugador: Jugador): void {
    let indices:number[] = this.girarRuleta()
    this.mostrarEnConsola(indices)
  }

  girarRuleta(): number[]{
    let indices: number[] = new Array(this.rodillos.length);
    for (let i = 0; i < this.rodillos.length; i++) {
      indices.push(this.nrosAleatorios.generarNumeroAleatorio());
    }
    return indices
  }

  mostrarEnConsola(indices: number[]){
    console.log(`Linea central: | ${this.rodillos[indices[0]]} | ${this.rodillos[indices[1]]} | ${this.rodillos[indices[2]]} `);
  }

}