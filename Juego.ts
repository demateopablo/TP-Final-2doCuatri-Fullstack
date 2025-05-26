import { IJuego } from "./IJuego";
import { Jugador } from "./Jugador";

export abstract class Juego implements IJuego{
  protected nombre: string;
  protected apuestaMin: number;

  constructor(nombre: string, apuestaMin: number){
    this.nombre = nombre;
    this.apuestaMin = apuestaMin;
  }

  jugadorApto(monedero: number): boolean{
    return (monedero > this.apuestaMin)
  }

  toString(): string{
    return this.nombre;
  }

  abstract jugar(jugador:Jugador): void;
  abstract pagar(pago: number, jugador: Jugador): void;

}