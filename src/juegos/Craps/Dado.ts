import { GeneradorNumeroAleatorio } from "../../servicios/GeneradorNumeroAleatorio";
import { colores } from "../../sistema/configColores";

export class Dado {
  private caras: number;
  private generadorAleatorio: GeneradorNumeroAleatorio;
  private arrayCaras: string[][] = [];

  constructor(pCaras: number) {
    this.caras = pCaras;
    this.generadorAleatorio = new GeneradorNumeroAleatorio(1, this.caras)
    this.arrayCaras = [[`       `, `   ●   `, `       `], [` ●     `, `       `, `     ● `], [` ●     `, `   ●   `, `     ● `], [` ●   ● `, `       `, ` ●   ● `], [` ●   ● `, `   ●   `, ` ●   ● `], [` ● ● ● `, `       `, ` ● ● ● `]]
  }

  public arrojarDado(): number {
    return this.generadorAleatorio.generarNumeroAleatorio()
  }

  public imprimirCaraDado(valor1: number, valor2: number): string {
    let carasString: string = "";
    for (let i = 0; i < this.arrayCaras[0].length; i++) {
      carasString += `${colores.fondoBlanco}${this.arrayCaras[valor1 - 1][i]}${colores.neutro}     ${colores.fondoBlanco}${this.arrayCaras[valor2 - 1][i]}${colores.neutro}\n`;
    }
    return carasString;
  }
}