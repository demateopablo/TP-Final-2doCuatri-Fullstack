import * as rdl from 'readline-sync';
import * as fs from 'fs';
import { Casino } from "./Casino";
import { Jugador } from "../entidades/Jugador";
import { FabricaDeJuegos } from './FabricaDeJuegos';
import { SaldoInsuficienteError, EdadInsuficienteError, EdadMayorAlLimiteError, EdadMenorACeroError, InstanciaExistenteError, OpcionInvalidaError, SaldoNegativoError } from './errores/ErroresPersonalizados';
import { colores } from '../sistema/configColores'

export class Aplicacion {

  public static instancia: Aplicacion; // patron de diseño Singleton
  private casino: Casino;
  private jugador: Jugador;
  private edadMinima: number;
  private edadMaxima: number;

  constructor() {
    this.edadMinima = 18;
    this.edadMaxima = 90;
    this.casino = new Casino("Money.for(nothing)");
    this.jugador = this.crearJugador();
  }

  // patron de diseño Singleton
  public static getInstancia(): Aplicacion {
    try {
      if (!this.instancia) {
        this.instancia = new Aplicacion();
      }
      else throw new InstanciaExistenteError();
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
      "Ruleta"
    ];

    let fabrica = new FabricaDeJuegos();

    for (let juego of todosLosJuegos) {
      let nuevoJuego = fabrica.fabricarJuego(juego);
      if (nuevoJuego !== undefined) this.casino.agregarJuego(nuevoJuego);
    }

    console.log(`${colores.saludo}  ~~ Bienvenid@ ${colores.saludo + '\x1b[1m'}${this.jugador.getNombre()}${colores.neutro}${colores.saludo} al Casino ${this.casino.getNombre()} ~~  ${colores.neutro}\n`);
    console.log(`→ Su saldo actual es de: ${colores.saldoCero} $${this.jugador.getMonedero()} ${colores.neutro}. ¡No olvides hacer tu recarga!\n`);
    this.mostrarMenu();
  }

  private crearJugador(): Jugador {
    let nombre: string = rdl.question("Ingresa tu nombre: ");
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(); //capitalizamos la primer letra del nombre
    let edad: number = rdl.questionInt("Ingresa tu Edad: ");
    if (!this.validarEdad(edad)) {
      return this.crearJugador();
    }
    console.clear();
    return new Jugador(nombre, edad);
  }

  private validarEdad(edad: number): boolean {
    try {
      if (edad < 1) throw new EdadMenorACeroError(); //Como va a tener menos de un año?
      if (edad > this.edadMaxima) throw new EdadMayorAlLimiteError(); //mas de 80 se pueden morir de un infarto!!!
      if (edad < this.edadMinima) throw new EdadInsuficienteError(this.edadMinima);
      return true
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
      console.error(`${(error as SaldoInsuficienteError).message}\n`);
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
      console.log(`${this.jugador.getMonedero() > 0 ? colores.saldoPositivo : colores.saldoCero} → Tu nuevo saldo es $${this.jugador.getMonedero()} ${colores.neutro}\n`);
    } catch (error) {
      console.error(`\n${(error as SaldoNegativoError).message}\n`)
    }
    this.mostrarMenu();
  }

  private mostrarSaldo(): void {
    console.clear();
    console.log(`${this.jugador.monederoToString()}`);
    this.mostrarMenu();
  }

  private volverAJugarOIrAlMenu(opcion: number): void {
    console.log("¿Deseas volver a jugar, o regresar al menú principal?")
    console.log("1 Volver a jugar");
    console.log("2 Ir al menú principal");
    console.log("---------------");
    console.log(`${colores.salir}0 Salir${colores.neutro}`);
    console.log("---------------");
    let op: number = this.preguntar(`Elije una opcion: `, 2);
    if (op === 1) {
      try {
        if (!this.casino.getJuego(opcion - 1).leAlcanzaParaJugar(this.jugador.getMonedero())) {
          throw new SaldoInsuficienteError();
        }
      } catch (error) {
        console.clear();
        console.error(`${(error as SaldoInsuficienteError).message}\n`);
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
    try {
      opcElegida = rdl.questionInt(mensaje);
      if (opcElegida < 0 || opcElegida > cantOpciones) throw new OpcionInvalidaError;
      else return opcElegida;
    }
    catch (error) {
      console.error((error as OpcionInvalidaError).message);
      return this.preguntar("Elija una opcion: ", this.casino.getCantJuegos() + 2);
    }
  }


  private exportarSaldo(): void {
    let fecha: string = new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
    fs.appendFileSync(`./saldos/${this.jugador.getNombre()}_saldo.txt`, `${fecha}\n${this.jugador.getMonedero()}\n\n`);
    console.log(`${colores.saludo} Saldo guardado correctamente.${colores.neutro} `);
  }
}
