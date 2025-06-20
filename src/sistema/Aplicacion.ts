import * as rdl from 'readline-sync';
import * as fs from 'fs';
import { Casino } from "./Casino";
import { Jugador } from "../entidades/Jugador";
import { FabricaDeJuegos } from './FabricaDeJuegos';
import { SaldoNegativoError } from './errores/ErroresPersonalizados';
import { SaldoInsuficienteError } from './errores/ErroresPersonalizados';
import { EdadInsuficienteError } from './errores/ErroresPersonalizados';
import { colores } from '../sistema/configColores'

export class Aplicacion {

  public static instancia: Aplicacion; // patron de diseño Singleton
  private casino: Casino;
  private jugador: Jugador;
  private edadMinima: number;

  constructor() {
    this.edadMinima = 18;
    this.casino = new Casino("Money.for(nothing)");
    this.jugador = this.crearJugador();
  }

  // patron de diseño Singleton
  public static getInstancia(): Aplicacion {
    try {
      if (!this.instancia) {
        this.instancia = new Aplicacion();
      }
      else throw new Error("La instancia ya existe");
    } catch (error) {
      console.error(`\n${(error as Error).message}`)
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
      let nuevoJuego = fabrica.fabricarJuego(juego);
      this.casino.agregarJuego(nuevoJuego);
    }

    console.log(`${colores.saludo}  ~~ Bienvenid@ ${this.jugador.getNombre()} al Casino ${this.casino.getNombre()} ~~  ${colores.neutro}\n`);
    console.log(`→ Su saldo actual es de: ${colores.saldoCero}$${this.jugador.getMonedero()}${colores.neutro}. ¡No olvides hacer tu recarga!\n`);
    this.mostrarMenu();
  }

  private crearJugador(): Jugador {
    let nombre: string = rdl.question("Ingresa tu nombre: ");
    let edad: number = rdl.questionInt("Ingresa tu Edad: ");
    if (!this.validarEdad(edad)) {
      return this.crearJugador();
    }
    console.clear();
    return new Jugador(nombre, edad);
  }

  private validarEdad(edad: number): boolean {
    try {
      if (edad >= this.edadMinima) return true
      else throw new EdadInsuficienteError();
    } catch (error) {
      console.error(`\n${(error as EdadInsuficienteError).message}\n`)
      return false;
    }
  }

  private mostrarMenu(): void {
    this.casino.listarJuegos();
    console.log("---------------");
    console.log(`${colores.opcionesMenu}${this.casino.getCantJuegos() + 1} Cargar saldo${colores.neutro}`);
    console.log(`${colores.opcionesMenu}${this.casino.getCantJuegos() + 2} Consultar saldo${colores.neutro}`);
    console.log(`${colores.salir}0 Salir${colores.neutro}`);
    console.log("---------------");
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

  private ejecutarJuego(idJuego: number): void {
    console.clear();
    let juego = this.casino.getJuego(idJuego - 1);
    try {
      if (juego.leAlcanzaParaJugar(this.jugador.getMonedero())) {
        juego.jugar(this.jugador);
        this.volverAJugarOIrAlMenu(idJuego);
      } else {
        throw new SaldoInsuficienteError();
      }

    } catch (error) {
      console.clear();
      console.error(`\n${(error as SaldoInsuficienteError).message}`);
      this.mostrarMenu();
    }
  }

  private cargarSaldo(): void {
    try {
      let saldo: number = rdl.questionInt("Ingrese el saldo a cargar: $");
      if (saldo <= 0) {
        throw new SaldoNegativoError();
      }
      this.jugador.modificarSaldo(saldo);
      console.clear();
      console.log(`${this.jugador.getMonedero() > 0 ? colores.saldoPositivo : colores.saldoCero}→ Tu nuevo saldo es $${this.jugador.getMonedero()}${colores.neutro}\n`);
    } catch (error) {
      console.error(`\n${(error as SaldoNegativoError).message}`)
    }
    this.mostrarMenu();
  }

  private mostrarSaldo(): void {
    console.clear();
    console.log(`${this.jugador.getMonedero() > 0 ? colores.saldoPositivo : colores.saldoCero}Su saldo actual es de $${this.jugador.getMonedero()}${colores.neutro}\n`);
    this.mostrarMenu();
  }

  private volverAJugarOIrAlMenu(opcion: number): void {
    console.log("¿Deseas volver a jugar, o regresar al menú principal?")
    console.log("1 Volver a jugar");
    console.log("2 Ir al menú principal");
    console.log("---------------");
    console.log("0 Salir");
    console.log("---------------");
    let op: number = this.preguntar(`Elije una opcion: `, 2);
    if (op === 1) {
      try {
        if (!this.casino.getJuego(opcion - 1).leAlcanzaParaJugar(this.jugador.getMonedero())) {
          throw new SaldoInsuficienteError();
        }
      } catch (error) {
        console.clear();
        console.error(`\n${(error as SaldoInsuficienteError).message}`);
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

  private exportarSaldo(): void {
    let fecha: string = new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
    fs.appendFileSync(`./saldos/${fecha}_saldo.txt`, `${this.jugador.toString()}\n\n`);
    console.log(`${colores.saludo}Saldo guardado correctamente.${colores.neutro}`);
  }
}
