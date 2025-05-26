import { IJuego } from "./IJuego";
import { Jugador } from "./Jugador";

export abstract class Juego implements IJuego{
  protected nombre: string;
  protected apuestaMin: number;

  constructor(nombre: string, apuestaMin: number){
    this.nombre = nombre;
    this.apuestaMin = apuestaMin;
  }

  //Verifica si el jugador tiene saldo suficiente para jugar al juego
  jugadorApto(monedero: number): boolean{
    return (monedero >= this.apuestaMin)
  }

  //Imprime nombre del juego
  toString(): string{
    return this.nombre;
  }

  abstract jugar(jugador:Jugador): void;
  abstract pagar(apuesta: number, jugador: Jugador): void;

}
