import * as rdl from 'readline-sync';
import * as fs from 'fs';
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

    console.log(`  ~~ Bienvenid@ ${this.jugador.getNombre()} al Casino ${this.casino.getNombre()} ~~  \n`);
    console.log(`→ Tu saldo actual es de: $${this.jugador.getMonedero()}. ¡No olvides hacer tu recarga!\n`);
    this.mostrarMenu();
  }

  private crearJugador(): Jugador {
    console.clear();
    let nombre: string = rdl.question("Ingresa tu nombre: ");
    let edad: number = rdl.questionInt("Ingresa tu Edad: ");
    let jugador = new Jugador(nombre, edad);
    console.clear();
    return jugador;
  }

  private getJugador(): void {
    console.log(`\n${this.jugador.toString()}`);
  }

  private mostrarMenu(): void {
    this.casino.listarJuegos();
    console.log("----------");
    console.log(`${this.casino.getCantJuegos() + 1} Cargar saldo`);
    console.log(`${this.casino.getCantJuegos() + 2} Consultar saldo`);
    console.log("0 Salir");
    console.log("----------");
    let opcion: number = this.preguntar("Elija una opcion: ", this.casino.getCantJuegos() + 2);
    console.log("");
    switch (opcion) {
      case 0: {
        this.exportarSaldo();
        return;
      };
      case this.casino.getCantJuegos() + 1: {
        this.cargarSaldo();
        break;
      };
      case this.casino.getCantJuegos() + 2: {
        this.mostrarSaldo();
        break;
      };
      default: {
        this.ejecutarJuego(opcion);
        break;
      }
    }
  }

  private ejecutarJuego(idJuego: number) {
    console.clear();
    let juego = this.casino.getJuego(idJuego - 1);
    if (juego.leAlcanzaParaJugar(this.jugador.getMonedero())) {
      juego.jugar(this.jugador);
      this.volverAJugarOIrAlMenu(idJuego);
    } else {
      console.log("No tenes un mango ratón. Cargá saldo y volvé\n");
      this.mostrarMenu();
    }
  }
  private cargarSaldo(): void {
    let saldo: number = rdl.questionInt("Ingrese el saldo a cargar: $");
    this.jugador.modificarSaldo(saldo);
    console.clear();
    console.log(`→ Tu nuevo saldo es $${this.jugador.getMonedero()}\n`);
    this.mostrarMenu();
  }

  private mostrarSaldo(): void {
    console.clear();
    console.log(`Su saldo actual es de $${this.jugador.getMonedero()}\n`);
    this.mostrarMenu();
  }

  private volverAJugarOIrAlMenu(opcion: number): void {
    console.log("¿Deseas volver a jugar, o regresar al menú principal?")
    console.log("1 Volver a jugar");
    console.log("2 Ir al menú principal");
    console.log("--------");
    console.log("0 Salir");
    console.log("--------");
    let op: number = this.preguntar(`Elije una opcion: `, 2);
    if (op === 1) {
      if (!this.casino.getJuego(opcion).leAlcanzaParaJugar(this.jugador.getMonedero())) {
        console.clear();
        console.log(`No tenes saldo suficiente para jugar a este juego.\n`);
        this.mostrarMenu();
      }
      this.ejecutarJuego(opcion);
    } else if (op === 0) {
      this.exportarSaldo(); return;
    }
    else {
      console.clear();
      this.mostrarMenu();
    }
  }

  private preguntar(mensaje: string, cantOpciones: number): number {
    let opcElegida: number;
    do {
      opcElegida = rdl.questionInt(mensaje);
    } while (opcElegida < 0 || opcElegida > cantOpciones)
    return opcElegida;
  }

  private exportarSaldo() {
    let fecha: string = new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
    fs.writeFileSync(`./saldos/${fecha}_saldo.txt`, this.jugador.toString());
    console.log('\nSaldo guardado correctamente.');
  }
}
