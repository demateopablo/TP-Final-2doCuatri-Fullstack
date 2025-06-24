import { Juego } from "./Juego";
import { colores } from '../sistema/configColores'

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
    return `\n--------------------------------------\n → Su saldo actual es de $${this.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.getMonedero()}${colores.neutro}\n--------------------------------------\n`
  }

  apostar(juego: Juego): void {
    juego.jugar(this);
  }

  toString(): string {
    return `Nombre: ${this.nombre}\nEdad: ${this.edad}\nSaldo: $${this.monedero}`;
  }



}