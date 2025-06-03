import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    super(3, ["🛩️", "♦️", "♥️", "👍", "🤩"]);
  }

  jugar(jugador: Jugador): void {
    let apuesta: number = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
      if(apuesta >= this.apuestaMin){
        jugador.modificarSaldo((-1)*apuesta);
        this.logicaTragamonedas(jugador,apuesta)
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.jugar(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  logicaTragamonedas(jugador: Jugador,apuesta: number){
    this.mostrarEnConsola(this.girarRuleta());
  }

  girarRuleta(): number[]{
    let indices: number[] = new Array(this.cantRodillos);
    for (let i = 0; i < indices.length; i++) {
      indices[i] = (this.nrosAleatorios.generarNumeroAleatorio());
    }
    console.log(indices);
    return indices
  }

  mostrarEnConsola(indices: number[]){
    console.log(`Linea central: | ${this.rodillo[indices[0]]} | ${this.rodillo[indices[1]]} | ${this.rodillo[indices[2]]} `);
  }

}