import * as rdl from 'readline-sync';
import { Casino } from "./Casino";
import { Jugador } from "./Jugador";
import { FabricaDeJuegos } from './FabricaDeJuegos';

export class Aplicacion{

  public static instancia: Aplicacion; // patron de diseño Singleton
  private casino: Casino;
  private jugador: Jugador;

  constructor(casino: Casino, jugador: Jugador){
    this.casino = casino;
    this.jugador = jugador;
  }

  
  // registrarJugador(jugador: Jugador){
    //   try {
      //     if (jugador.getEdad() > this.casino.getEdadMin()) {
        //       this.jugadores.push(jugador);
        //     }
        //   } catch (error) {
          //     let e: Error = new Error("\nNo tienes edad suficiente para ingresar al casino\n")
          //     console.log(e.message);
          //   }
          // }
          
          // patron de diseño Singleton

  public static getInstancia(casino: Casino, jugador: Jugador): Aplicacion{
    if(!this.instancia){  
        this.instancia = new Aplicacion(casino, jugador);
    }else{
        console.log("la instancia ya existe");
    }
    return this.instancia;
  }

  inicializar(){
    
    let todosLosJuegos: string[] = [
      "Craps",
      "Blackjack",
      // "Tragamonedas3",
      // "Tragamonedas5",
      // "Ruleta",
    ];

    let fabrica = new FabricaDeJuegos();

    for(let juego of todosLosJuegos){
      let nuevoJuego = fabrica.crear(juego);
      this.casino.agregarJuego(nuevoJuego);
    }

    this.mostrarMenu();
  }

  getJugador(): void{
    console.log(`\n${this.jugador.toString()}`);
  }

  mostrarMenu():void{
    console.log(`Bienvenido a Casino ${this.casino.getNombre()}`);
    this.casino.listarJuegos();
    console.log("0 Salir");
    let opcion: number = this.preguntar("Elija una opcion: ",this.casino.getCantJuegos());
    if (opcion == 0) {
      console.log("Funcion salir y exportar saldo");
    }else{
      this.casino.getJuego(opcion-1).jugar(this.jugador);
    }
    this.mostrarMenu();
  }

  preguntar(mensaje: string, cantOpciones: number): number{
    let opcElegida: number;
    do{
    opcElegida= rdl.questionInt(mensaje);
    } while (opcElegida < 0 || opcElegida > cantOpciones)
    return opcElegida;
  }
  
}
