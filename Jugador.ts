import { Juego } from "./Juego";

export class Jugador{
  private nombre:string;
  private edad: number;
  private monedero:number;

  constructor(nombre: string, edad: number){
    this.nombre = nombre;
    this.edad = edad;
    this.monedero = 0;
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
    this.monedero += monto;
  }

  apostar(juego: Juego): void{
    juego.jugar(this);
  }

  toString(): string{
    return `\nNombre:\t${this.nombre}\nEdad:\t${this.edad}\nSaldo:\t${this.monedero}`;
  }



}