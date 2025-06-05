import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  constructor() {
    // super(3, 3, [" GUS", " TA ", " VO ", " A  ", "RIAS"]);
    // super(3, 3, ["🛩️ ", "♦️ ", "♥️ ", "👍", "🤩"]);
    super(3, 3, ["🛩️ ", "♦️ ", "♥️ "]);

  }

  jugar(jugador: Jugador): void {
    const PESOS: number = super.pedirApuesta(jugador);
    let cantTiradasPosibles: number = Math.floor(PESOS / this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles, jugador)
  }

  menuCantGiros(cantTiradasPosibles: number, jugador: Jugador) {
    let opcGiros: number;
    do {
      opcGiros = rdl.questionInt(`Jugadas disponibles:\n\t1 - Girar una vez\n\t2 - Girar ${cantTiradasPosibles} veces\n\t0 - Retirarse\nIngrese la opcion deseada: `);
    } while (opcGiros > 2 && opcGiros < 0)
    this.opcCantGiros(opcGiros, cantTiradasPosibles, jugador)
  }

  opcCantGiros(opc: number, cantTiradasPosibles: number, jugador: Jugador): void {
    switch (opc) {
      case 1:
        super.jugar(jugador);
        cantTiradasPosibles--;
        if (cantTiradasPosibles > 0) {
          this.menuCantGiros(cantTiradasPosibles, jugador);
        }
        break;
      case 2:
        for (let i = 0; i < cantTiradasPosibles; i++) {
          super.jugar(jugador);
        }
        break;
      default: // 0
        jugador.modificarSaldo(cantTiradasPosibles * this.apuestaMin);
        console.log(`Usted se ha retirado del juego.\n\t→ El dinero restante se ha devuelto a su monedero.`);
        return;
    }
  }

  verSiGana() {
    
    if (this.matrizRodillos[0][0] === this.matrizRodillos[0][1] && this.matrizRodillos[0][1] === this.matrizRodillos[0][2]) {
      console.log(`Coincidencia en linea superior!!`);
      //this.pagar()
    }
    if (this.matrizRodillos[1][0] === this.matrizRodillos[1][1] && this.matrizRodillos[1][1] === this.matrizRodillos[1][2]) {
      console.log(`Coincidencia en linea central!!`);

    }
    if (this.matrizRodillos[2][0] === this.matrizRodillos[2][1] && this.matrizRodillos[2][1] === this.matrizRodillos[2][2]) {
      console.log(`Coincidencia en linea inferior!!`);

    }
  }

  pagar(apuesta: number, jugador: Jugador): void {

  }



}