import * as rdl from 'readline-sync';
import { Jugador } from "../../../Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas3 extends Tragamonedas {
  private mu: number = (this.cantLineas+1)/2;
  private sigma: number = 0.7;

  constructor() {
    // super(3, 3, [" GUS", " TA ", " VO ", " A  ", "RIAS"]);
    // super(3, 5, ["🛩️ ", "♦️ ", "♥️ ", "👍", "🤩"]);
    super(3, 5, ["🛩️ ", "♦️ ", "♥️ ", "🤩"]);

  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    const PESOS: number = super.pedirApuesta();
    let cantTiradasPosibles: number = Math.floor(PESOS / this.apuestaMin);
    jugador.modificarSaldo(PESOS % this.apuestaMin); //devuelve el resto
    console.log(`Usted dispone de ${cantTiradasPosibles} giros`);
    this.menuCantGiros(cantTiradasPosibles);
    console.log(`\n--------------------------------------\nSu saldo actual es de ${this.jugador.getMonedero()}\n--------------------------------------\n`);
  }

  menuCantGiros(cantTiradasPosibles: number) {
    let opcGiros: number;
    do {
      opcGiros = rdl.questionInt(`Jugadas disponibles:\n\t1 - Girar una vez\n\t2 - Girar ${cantTiradasPosibles} veces\n\t0 - Retirarse\nIngrese la opcion deseada: `);
    } while (opcGiros > 2 && opcGiros < 0)
    this.opcCantGiros(opcGiros, cantTiradasPosibles)
  }

  opcCantGiros(opc: number, cantTiradasPosibles: number): void {
    let multiplicadorGanancia: number = 0;
    switch (opc) {
      case 1:
        super.jugar(this.jugador);
        multiplicadorGanancia = this.verSiGana();
        if (multiplicadorGanancia != 0) {
          this.pagar(this.apuestaMin * multiplicadorGanancia);
        }
        cantTiradasPosibles--;
        console.log(`------- Giros restantes: ${cantTiradasPosibles} -------`);
        if (cantTiradasPosibles > 0) {
          this.menuCantGiros(cantTiradasPosibles);
        }
        break;
      case 2:
        for (let i = 0; i < cantTiradasPosibles; i++) {
          super.jugar(this.jugador);
          multiplicadorGanancia += this.verSiGana();
          console.log(multiplicadorGanancia);
        }
        console.log(multiplicadorGanancia);
        this.pagar(this.apuestaMin * multiplicadorGanancia);
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

  verSiGana(): number {
    let multiplicadorGanancia: number = 0;
    let gauss: number = 0;
    for (let i = 0; i < this.cantLineas; i++) {
      if (this.verificarFila(i)) {
        console.log(`Coincidencia en linea ${i + 1}`);
        gauss = Math.ceil(((super.gaussiana(i+1,this.mu,this.sigma)*100)/2)+1);
        console.log(gauss);
        multiplicadorGanancia += gauss
        console.log(multiplicadorGanancia);
      }
    }
    if (multiplicadorGanancia === 0) return 0;
    return multiplicadorGanancia;
  }

  pagar(apuesta: number): void {
    this.jugador.modificarSaldo(apuesta);
    console.log(`✅ Se te acreditaron $${apuesta} en tu monedero.`)
  }
}