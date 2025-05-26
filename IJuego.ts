import { Jugador } from "./Jugador";

export interface IJuego{
  jugar(jugador:Jugador): void;
  pagar(pago: number, jugador: Jugador): void;
}