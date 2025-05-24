import { Juego } from "./Juego";
import { Jugador } from "./Jugador";

export class Casino {
  private nombre:string;
  private jugadores: Jugador[];
  private juegos: Juego[];

  constructor(nombre: string) {
    this.nombre = nombre;
    this.jugadores = new Array();
    this.juegos = new Array();
  }

  listarJuegos(): void{
    for (let i = 0; i < this.juegos.length; i++) {
      console.log(`${i+1} ${this.juegos.toString()}`);
    }
  }


}