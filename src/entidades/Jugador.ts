import { Juego } from "./Juego";

export class Jugador {
  private nombre: string;
  private edad: number;
  private monedero: number;

  constructor(nombre: string, edad: number) {
    this.nombre = nombre;
    this.edad = edad;
    this.monedero = 0;
  }

  getNombre(): string {
    return this.nombre;
  }

  getEdad(): number {
    return this.edad;
  }

  getMonedero(): number {
    return this.monedero;
  }

  modificarSaldo(monto: number): void {
    this.monedero += monto;
  }

  monederoToString(): string {
    return `Tu saldo actual es de $${this.monedero}.`
  }

  apostar(juego: Juego): void {
    juego.jugar(this);
  }

  toString(): string {
    return `Nombre: ${this.nombre}\nEdad: ${this.edad}\nSaldo: $${this.monedero}`;
  }



}