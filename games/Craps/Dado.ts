import { generadorNumeroAleatorio } from "../../GeneradorNumeroAleatorio";

export class Dado{
  private caras: number;
  private generadorAleatorio: generadorNumeroAleatorio;

  constructor(pCaras: number){
    this.caras = pCaras;
    this.generadorAleatorio = new generadorNumeroAleatorio(1,this.caras)
  }

  arrojarDado(): number{
    return this.generadorAleatorio.generarNumeroAleatorio()
  }

  imprimirCaraDado(valor: number): number{
    return 9856+(valor-1);
  }
}