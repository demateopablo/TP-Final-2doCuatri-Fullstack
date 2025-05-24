import { Juego } from "./Juego";

export class Jugador{
  public nombre:string;
  public monedero:number;

  constructor(nombre: string, monedero: number){
    this.nombre = nombre;
    this.monedero = monedero;
  }

  modificarSaldo(monto: number): void{
    this.monedero = monto;
  }

  apostar(juego: Juego): void{
    juego.jugar(this);
  }





}