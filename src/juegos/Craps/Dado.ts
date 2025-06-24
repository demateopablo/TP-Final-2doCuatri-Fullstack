import { GeneradorNumeroAleatorio } from "../../servicios/GeneradorNumeroAleatorio";

export class Dado {
  private caras: number;
  private generadorAleatorio: GeneradorNumeroAleatorio;
  private arrayCaras: string[][] = [];

  constructor(pCaras: number) {
    this.caras = pCaras;
    this.generadorAleatorio = new GeneradorNumeroAleatorio(1, this.caras)
    this.arrayCaras = [[`|     |`, `|  o  |`, `|     |`], [`|o    |`, `|     |`, `|    o|`], [`|o    |`, `|  o  |`, `|    o|`], [`|o   o|`, `|     |`, `|o   o|`], [`|o   o|`, `|  o  |`, `|o   o|`], [`|o o o|`, `|     |`, `|o o o|`]]
  }

  public arrojarDado(): number {
    return this.generadorAleatorio.generarNumeroAleatorio()
  }

  public imprimirCaraDado1(valor: number): number{
    return 9856+(valor-1);
  }

  public imprimirCaraDado2(valor1: number, valor2: number): string {
    let carasString: string = "";
    for (let i = 0; i < this.arrayCaras[0].length; i++) {
      carasString += `${this.arrayCaras[valor1 - 1][i]}     ${this.arrayCaras[valor2 - 1][i]}\n`;
    }
    return carasString;
  }
}