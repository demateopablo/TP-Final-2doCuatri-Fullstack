import { Juego } from "../entidades/Juego";
import { colores } from '../sistema/configColores'

export class Casino {
  private nombre:string;
  private juegos: Juego[];

  constructor(nombre: string) {
    this.nombre = nombre;
    this.juegos = new Array();
  }

  getNombre(): string{
    return this.nombre;
  }

  getJuego(index: number): Juego{
    return this.juegos[index];
  }

  getCantJuegos(): number{
    return this.juegos.length;
  }

  agregarJuego(juego: Juego): void{
    this.juegos.push(juego);
  }

  listarJuegos(): void{
    for (let i = 0; i < this.juegos.length; i++) {
      console.log(`${colores.juegos}${i+1} ${this.juegos[i].toString()}${colores.neutro}`);
    }
  }

}