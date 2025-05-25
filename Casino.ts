import { Juego } from "./Juego";
// import { Jugador } from "./Jugador";

export class Casino {
  private nombre:string;
  // private jugadores: Jugador[];
  private juegos: Juego[];
  private edadMin: number = 18;

  constructor(nombre: string) {
    this.nombre = nombre;
    // this.jugadores = new Array();
    this.juegos = new Array();
  }

  getNombre(): string{
    return this.nombre;
  }

  getEdadMin(): number{
    return this.edadMin;
  }

  getJuego(index: number): Juego{
    return this.juegos[index];
  }

  agregarJuego(juego: Juego): void{
    this.juegos.push(juego);
  }

  listarJuegos(): void{
    for (let i = 0; i < this.juegos.length; i++) {
      console.log(`${i+1} ${this.juegos[i].toString()}`);
    }
  }


}