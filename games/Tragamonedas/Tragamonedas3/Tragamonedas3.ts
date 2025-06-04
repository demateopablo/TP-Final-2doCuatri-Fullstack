import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    super(3, 3, ["🛩️", "♦️", "♥️", "👍", "🤩"]);
  }

  jugar(jugador: Jugador): void {
    let apuesta: number = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
      if(apuesta >= this.apuestaMin){
        jugador.modificarSaldo((-1)*apuesta);
        this.girarRuleta();
        // this.logicaTragamonedas(jugador,apuesta)
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.jugar(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  // logicaTragamonedas(jugador: Jugador,apuesta: number){
  //   this.mostrarEnConsola(this.girarRuleta());
  // }

  girarRuleta(): void{
    // let linea: string[] = [];
    let indice: number;
    // let indices: number[] = new Array(this.cantRodillos);
    for (let i = 0; i < this.cantLineas; i++) {
      for (let j = 0; j < this.cantRodillos; j++) {
        indice = this.nrosAleatorios.generarNumeroAleatorio();
        console.log(indice);
        this.agregarAMatriz(this.rodillo[indice])
      }
    }
    console.log(this.rodillo);
    console.log(this.matrizRodillos);
    this.mostrarEnConsola();
    // return indices
  }

  agregarAMatriz(item: string):void{
    for (let i = 0; i < this.cantRodillos; i++) {
      for (let j = 0; j < this.cantRodillos; j++) {
        this.matrizRodillos[i][j] = item;
      }
    }
  }

  mostrarEnConsola(){
    for (let i = 0; i < this.cantRodillos; i++) {
      console.log(`Linea ${i}: | ${this.matrizRodillos[i][0]}  | ${this.matrizRodillos[i][1]}  | ${this.matrizRodillos[i][2]}  |`);
      // console.log(`Linea central: | ${this.rodillo[indices[0]]} | ${this.rodillo[indices[1]]} | ${this.rodillo[indices[2]]} `);
    }
  }

}