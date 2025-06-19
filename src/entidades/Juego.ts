import { IJuego } from "./IJuego";
import { Jugador } from "./Jugador";
import { SaldoInsuficienteError, ApuestaInferiorError, OpcionInvalidaError, SaldoNegativoError } from "../sistema/errores/ErroresPersonalizados"

export abstract class Juego implements IJuego {
  protected nombre: string;
  protected apuestaMin: number;
  protected jugador!: Jugador; //se inicializa vacio y se asigna valor al jugar

  constructor(nombre: string, apuestaMin: number) {
    this.nombre = nombre;
    this.apuestaMin = apuestaMin;
  }

  //Verifica si el jugador tiene saldo suficiente para jugar al juego
  jugadorApto(monedero: number, apuesta: number): boolean {
    return (monedero >= this.apuestaMin && monedero >= apuesta)
  }

  leAlcanzaParaJugar(apuesta: number): boolean {
    return (apuesta >= this.apuestaMin)
  }

  //Imprime nombre del juego
  toString(): string {
    return this.nombre;
  }

  abstract jugar(jugador: Jugador): void;
  abstract pagar(apuesta: number): void;

}
