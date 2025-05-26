import { Juego } from "./Juego";

export class Jugador{
  private nombre:string;
  private edad: number
  private monedero:number;

  constructor(nombre: string, edad: number, monedero: number){
    this.nombre = nombre;
    this.edad = edad;
    this.monedero = monedero;
  }

  getNombre(): string{
    return this.nombre;
  }

  getEdad(): number{
    return this.edad;
  }

  getMonedero(): number{
    return this.monedero;
  }

  modificarSaldo(monto: number): void{
    // let suma: number = this.getMonedero() + monto;
    this.monedero += monto;
  }

  apostar(juego: Juego): void{
    juego.jugar(this);
  }

  toString(): string{
    return `\nNombre: ${this.nombre}\n\tEdad: ${this.edad}\n\tDinero: ${this.monedero}\n`;
  }



}