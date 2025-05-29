import * as rdl from 'readline-sync';
import { Casino } from "./Casino";
import { Jugador } from "./Jugador";
import { FabricaDeJuegos } from './FabricaDeJuegos';

export class Aplicacion {

  public static instancia: Aplicacion; // patron de diseño Singleton
  private casino: Casino;
  private jugador: Jugador;

  constructor() {
    this.casino = new Casino("Money.for(nothing)");
    this.jugador = this.crearJugador();
  }

  // patron de diseño Singleton
  public static getInstancia(): Aplicacion {
    if (!this.instancia) {
      this.instancia = new Aplicacion();
    } else {
      console.log("La instancia ya existe");
    }
    return this.instancia;
  }

  inicializar() {
    let todosLosJuegos: string[] = [
      "Craps",
      "Blackjack",
      "Tragamonedas3",
      "Tragamonedas5",
      "Ruleta",
    ];

    let fabrica = new FabricaDeJuegos();

    for (let juego of todosLosJuegos) {
      let nuevoJuego = fabrica.crear(juego);
      this.casino.agregarJuego(nuevoJuego);
    }

    console.log(`\n  ~~ Bienvenido a Casino ${this.casino.getNombre()} ~~ `);
    console.log(`→ Tu saldo actual es de: $${this.jugador.getMonedero()}. ¡No olvides hacer tu recarga!`);

    this.mostrarMenu();
  }

  crearJugador(): Jugador {
    let nombre: string = rdl.question("Ingresa tu nombre: ");
    let edad: number = rdl.questionInt("Ingresa tu Edad: ");
    let jugador = new Jugador(nombre, edad);
    return jugador;
  }

  getJugador(): void {
    console.log(`\n${this.jugador.toString()}`);
  }

  mostrarMenu(): void {
    console.log("");
    this.casino.listarJuegos();
    console.log("----------");
    console.log(`${this.casino.getCantJuegos() + 1} Cargar saldo`);
    console.log("0 Salir");
    console.log("----------");
    let opcion: number = this.preguntar("Elija una opcion: ", this.casino.getCantJuegos());
    console.log("");
    if (opcion == this.casino.getCantJuegos() + 1) {
      let saldo: number = rdl.questionInt("Ingrese el saldo a cargar: $");
      this.jugador.modificarSaldo(saldo);
      console.log(`→ Tu nuevo saldo es $${this.jugador.getMonedero()}`);
      this.mostrarMenu();
    }
    else if (opcion == 0) {
      console.log("Funcion salir y exportar saldo");
      return;
    } else {
      this.casino.getJuego(opcion - 1).jugar(this.jugador);
      this.volverAJugarOIrAlMenu(opcion);
    }
  }

  volverAJugarOIrAlMenu(opcion: number): void {
    console.log("¿Deseas volver a jugar, o regresar al menú principal?")
    console.log("1 Volver a jugar");
    console.log("2 Ir al menú principal");
    console.log("--------");
    console.log("0 Salir");
    console.log("--------");
    let op: number = this.preguntar("Elije una opcion: ", 2);
    if (op === 1) {
      this.casino.getJuego(opcion - 1).jugar(this.jugador);
      this.volverAJugarOIrAlMenu(opcion);
    } else if (op === 0) {
      console.log("Funcion salir y exportar saldo");
    }
    else this.mostrarMenu();
  }

  preguntar(mensaje: string, cantOpciones: number): number {
    let opcElegida: number;
    do {
      opcElegida = rdl.questionInt(mensaje);
    } while (opcElegida < 0 || opcElegida > cantOpciones + 1)
    return opcElegida;
  }

}
