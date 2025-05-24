import { Jugador } from "./Jugador";

export interface IJuego{
  jugar(jugador:Jugador): void;
  pagar(pPago: number): number;
}