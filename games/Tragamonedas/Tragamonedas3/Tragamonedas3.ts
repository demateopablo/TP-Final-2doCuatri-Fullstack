import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    // super(3, 3, [" GUS", " TA ", " VO ", " A  ", "RIAS"]);
    // super(3, 3, ["🛩️ ", "♦️ ", "♥️ ", "👍", "🤩"]);
    super(3, 3, ["🛩️ ", "♦️ ", "♥️ "]);

  }

  jugar(jugador: Jugador): void {
    const PESOS: number = super.pedirApuesta(jugador);
    let cantTiradasPosibles: number = Math.floor(PESOS/this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles, jugador)
  }

  menuCantGiros(cantTiradasPosibles: number, jugador: Jugador){
    let opcGiros: number;
    do{
      opcGiros = rdl.questionInt(`Ingrese la opcion deseada:\n\t1 - Girar una vez\n\t2 - Girar todas las veces posibles\n\t0 - Retirarse\n`);
    }while (opcGiros > 2 && opcGiros < 0)
    this.opcCantGiros(opcGiros,cantTiradasPosibles,jugador)
  }

  opcCantGiros(opc:number,cantTiradasPosibles:number,jugador: Jugador):void{
    switch (opc) {
      case 1:
        super.jugar(jugador);
        if (cantTiradasPosibles-1 > 0) {
          this.menuCantGiros(cantTiradasPosibles - 1, jugador)
        }
        break;
      case 2:
        for (let i = 0; i < cantTiradasPosibles; i++) {
          super.jugar(jugador);
        }
      break;
      default: {jugador.modificarSaldo(cantTiradasPosibles * this.apuestaMin); return};
    }
  }

  verSiGana() {
    if (this.matrizRodillos[0][0]===this.matrizRodillos[0][1] && this.matrizRodillos[0][1]===this.matrizRodillos[0][2]) {
      console.log(`Coincidencia en linea superior!!`);
      //this.pagar()
    }
    if (this.matrizRodillos[1][0]===this.matrizRodillos[1][1] && this.matrizRodillos[1][1]===this.matrizRodillos[1][2]) {
      console.log(`Coincidencia en linea central!!`);

    }
    if (this.matrizRodillos[2][0]===this.matrizRodillos[2][1] && this.matrizRodillos[2][1]===this.matrizRodillos[2][2]) {
      console.log(`Coincidencia en linea inferior!!`);

    }
  }

  pagar(apuesta: number, jugador: Jugador): void {
    
  }



}