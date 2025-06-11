import { Jugador } from "./Jugador";

export interface IJuego{
  jugar(jugador:Jugador): void;
  pagar(apuesta: number): void;
}
