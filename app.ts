import { Casino } from "./Casino";
import { Jugador } from "./Jugador";

export class Aplicacion{
  private casino: Casino;
  private jugadores: Jugador[];

  constructor(casino: Casino){
    this.casino = casino;
    this.jugadores = new Array();
  }

  registrarJugador(jugador: Jugador){
    try {
      if (jugador.getEdad() > this.casino.getEdadMin()) {
        this.jugadores.push(jugador);
      }
    } catch (e) {
      e = new Error("\nNo tienes edad suficiente para ingresar al casino\n")
      console.log(e);
    }
  }

  listarJugadores(): void{
    for (let i = 0; i < this.jugadores.length; i++) {
      console.log(`\n${i+1} ${this.jugadores[i].toString()}`);
    }
  }

  mostrarMenu():void{
    console.log(`Bienvenido a Casino ${this.casino.getNombre()}`);
    this.casino.listarJuegos();
  }
}