import { Juego } from "../entidades/Juego";

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
    //Falta control de error, que pasa si el index esta fuera del array?
    return this.juegos[index];
  }

  getCantJuegos(): number{
    return this.juegos.length;
  }

  agregarJuego(juego: Juego): void{
    //Control de error: Verificar que el juego no exista antes de agregarlo
    this.juegos.push(juego);
  }

  listarJuegos(): void{
    for (let i = 0; i < this.juegos.length; i++) {
      console.log(`${i+1} ${this.juegos[i].toString()}`);
    }
  }

}