import * as rdl from 'readline-sync';
import { Jugador } from "../../../entidades/Jugador";
import { Tragamonedas } from "../Tragamonedas";

export class Tragamonedas3 extends Tragamonedas {

  private static figuras: string[] = ["♠️ ", "♦️ ", "♥️ ", "♣️ ", "🎲", "⭐"];

  constructor() {
    //rodillos, lineas, figuras, apuestaMinima
    super(3, 5, Tragamonedas3.figuras, 100);
    this.mu = (this.cantLineas + 1) / 2; //Mu: el número de la línea central
    this.sigma = (this.cantLineas + 3 - Math.ceil(this.cantRodillos / this.cantLineas)) / 10; //Sigma: hace que el peso baje más o menos rápido cuando te alejás del centro
    this.atenuador = (this.cantLineas * 2 / this.cantRodillos) //Atenuador: equilibra la ganancia segun cant de lineas (divisor para bajar el premio final)
  }

  jugar(jugador: Jugador): void {
    super.jugar(jugador);
  }

   pagar(apuesta: number): void {
    this.jugador.modificarSaldo(apuesta);
    console.log(`✅ Se te acreditaron $${apuesta} en tu monedero.`)
  }
}