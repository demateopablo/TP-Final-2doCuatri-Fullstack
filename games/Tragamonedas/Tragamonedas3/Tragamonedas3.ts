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
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    const PESOS: number = super.pedirApuesta();
    let cantTiradasPosibles: number = Math.floor(PESOS / this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles);
  }

  menuCantGiros(cantTiradasPosibles: number) {
    let opcGiros: number;
    do {
      opcGiros = rdl.questionInt(`Jugadas disponibles:\n\t1 - Girar una vez\n\t2 - Girar ${cantTiradasPosibles} veces\n\t0 - Retirarse\nIngrese la opcion deseada: `);
    } while (opcGiros > 2 && opcGiros < 0)
    this.opcCantGiros(opcGiros, cantTiradasPosibles)
  }

  opcCantGiros(opc: number, cantTiradasPosibles: number): void {
    switch (opc) {
      case 1:
        super.jugar(this.jugador);
        cantTiradasPosibles--;
        if (cantTiradasPosibles > 0) {
          this.menuCantGiros(cantTiradasPosibles);
        }
        break;
      case 2:
        for (let i = 0; i < cantTiradasPosibles; i++) {
          super.jugar(this.jugador);
        }
        break;
      default: // 0
        this.jugador.modificarSaldo(cantTiradasPosibles * this.apuestaMin);
        console.log(`Usted se ha retirado del juego.\n\t→ El dinero restante se ha devuelto a su monedero. Saldo actual: $${this.jugador.getMonedero()}`);
        return;
    }
  }

  verificarFila(lin: number): boolean {
    let match: boolean = true;
    let valor: string = this.matrizRodillos[lin][0];
    let i: number = 1;
    while (match && i < this.cantRodillos) {
      match = (this.matrizRodillos[lin][i] === valor);
      i++;
    }
    return match;
  }

  verSiGana() {

    let multiplicadorGanancia: number = 0;

    for (let i = 0; i < this.cantLineas; i++) {
      if (this.verificarFila(i)) {
        console.log(`Coincidencia en linea ${i + 1}`);
        multiplicadorGanancia += 0.5;
      }
    }
    if (multiplicadorGanancia === 0) return;

    //Falta hacer un multiplicador dinamico en base a la linea que haga match
    /* if(matchEnLinea1){
      this.apuestaMin * (1 + multiplicadorGanancia); 
    }
    this.pagar(gananciaTotal); */

    let gananciaTotal:number = this.apuestaMin * (1 + multiplicadorGanancia);

    this.pagar(gananciaTotal);

    /*     if (this.matrizRodillos[0][0] === this.matrizRodillos[0][1] && this.matrizRodillos[0][1] === this.matrizRodillos[0][2]) {
          console.log(`Coincidencia en linea superior!!`);
          //this.pagar()
        }
        if (this.matrizRodillos[1][0] === this.matrizRodillos[1][1] && this.matrizRodillos[1][1] === this.matrizRodillos[1][2]) {
          console.log(`Coincidencia en linea central!!`);
    
        }
        if (this.matrizRodillos[2][0] === this.matrizRodillos[2][1] && this.matrizRodillos[2][1] === this.matrizRodillos[2][2]) {
          console.log(`Coincidencia en linea inferior!!`);
    
        } */
  }

  pagar(apuesta: number): void {
    this.jugador.modificarSaldo(apuesta);
    console.log(`✅ Se te acreditaron $${apuesta} en tu monedero.`)
  }
}