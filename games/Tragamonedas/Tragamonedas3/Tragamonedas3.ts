import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    // super(3, 3, [" GUS", " TA ", " VO ", " A  ", "RIAS"]);
    super(3, 5, ["🛩️ ", "♦️ ", "♥️ ", "👍", "🤩"]);
    // super(3, 3, ["🛩️ ", "♦️ ", "♥️ "]);

  }

  jugar(jugador: Jugador): void {
    let apuesta: number = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
      if(apuesta >= this.apuestaMin){
        jugador.modificarSaldo((-1)*apuesta);
        this.girarRodillos();
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.jugar(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  girarRodillos(): void{
    let indice: number;
    for (let i = 0; i < this.cantLineas; i++) {
      for (let j = 0; j < this.cantRodillos; j++) {
        indice = this.nrosAleatorios.generarNumeroAleatorio();
        this.matrizRodillos[i][j] = this.rodillo[indice];
      }
    }
    this.mostrarEnConsola();
  }

  mostrarEnConsola():void{
    let matrizToString: string = '';
    for (let i = 0; i < this.cantLineas; i++) {
      matrizToString += `Linea ${i+1}: |`;
      for (let j = 0; j < this.cantRodillos; j++) {
        matrizToString += ` ${this.matrizRodillos[i][j]} |`;
      }
      matrizToString +="\n";
    }
    console.log(`${matrizToString}`);
    this.verSiGana();
  }
  verSiGana() {
    if (this.matrizRodillos[0][0]===this.matrizRodillos[0][1] && this.matrizRodillos[0][1]===this.matrizRodillos[0][2]) {
      console.log(`Coincidencia en linea superior!!`);
      //this.pagar()
    }
    if (this.matrizRodillos[1][0]===this.matrizRodillos[1][1] && this.matrizRodillos[1][1]===this.matrizRodillos[1][2]) {
      console.log(`Coincidencia en linea central!!`);
      // console.log("Ganaste pa!!!");
      //this.pagar()
    }
    if (this.matrizRodillos[2][0]===this.matrizRodillos[2][1] && this.matrizRodillos[2][1]===this.matrizRodillos[2][2]) {
      console.log(`Coincidencia en linea inferior!!`);
      // console.log("Ganaste pa!!!");
      //this.pagar()
    }
  }

  pagar(apuesta: number, jugador: Jugador): void {
      
  }



}