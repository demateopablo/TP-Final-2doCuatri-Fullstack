import { Juego } from '../../entidades/Juego'
import { Jugador } from '../../entidades/Jugador'
import { Carta } from './Carta'
import * as rdl from 'readline-sync';
import { GeneradorNumeroAleatorio } from '../../servicios/GeneradorNumeroAleatorio';
import { ApuestaInferiorError, ApuestaExcesivaError } from '../../sistema/errores/ErroresPersonalizados';
import { colores } from '../../sistema/configColores'

//Objetivo del juego:
// El objetivo del Black Jack es que el jugador obtenga una suma de cartas lo más cercana posible a 21 sin pasarse, y ganarle al crupier.
//Cartas:
//Cartas del 2 al 10 → valen su número.
//J, Q y K → valen 10.
//As (A) → vale 1 o 11, según convenga para no pasarse de 21.

export class Blackjack extends Juego {
  private MAX_PUNTOS: number = 21;
  private MIN_PUNTOS_CRUPIER: number = 17;
  private MAZO: Carta[];
  private puntajeJugador: number;
  private puntajeCrupier: number;
  private cartasJugador: Carta[];
  private cartasCrupier: Carta[];
  private cantAsesJugador: number;
  private cantAsesCrupier: number;
  private puedePedir: boolean;
  private pagoGanador: number = 1.5;

  constructor() {
    super(`Blackjack`, 1500);
    // Jugador
    this.cartasJugador = [];
    this.puntajeJugador = 0;
    this.cantAsesJugador = 0;
    this.puedePedir = true;
    // Crupier
    this.cartasCrupier = [];
    this.puntajeCrupier = 0;
    this.cantAsesCrupier = 0;
    // Mazo
    this.MAZO = this.generarMazo();
    this.mezclarMazo();
  }

  private reiniciarPartida(): void {
    // Jugador
    this.cartasJugador = [];
    this.puntajeJugador = 0;
    this.cantAsesJugador = 0;
    this.puedePedir = true;
    // Crupier
    this.cartasCrupier = [];
    this.puntajeCrupier = 0;
    this.cantAsesCrupier = 0;
    // Mazo
    this.MAZO = this.generarMazo();
    this.mezclarMazo();
  }

  private generarMazo(): Carta[] {
    const palos: string[] = ['♠️', '♥️', '♦️', '♣️'];
    const valores: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const mazo: Carta[] = [];

    palos.forEach((palo) => {
      valores.forEach((valor) => {
        mazo.push(new Carta(valor, palo));
      })
    })
    return mazo;
  }

  private mezclarMazo(): void {
    for (let i = this.MAZO.length - 1; i > 0; i--) {
      const j: number = new GeneradorNumeroAleatorio(0, i + 1).generarNumeroAleatorio();
      [this.MAZO[i], this.MAZO[j]] = [this.MAZO[j], this.MAZO[i]];
    }
  }
  private obtenerCartaAleatoria(): Carta {
    return this.MAZO.pop()!;
    //el ! al final es para asegurarle a typescript que nunca va a ser undefined. (Con un solo jugador en el blackjack no pasaria nunca)
  }

  public jugar(jugador: Jugador): void {
    this.jugador = jugador;
    this.reiniciarPartida();

    const apuesta = this.pedirApuesta();
    if (apuesta < this.apuestaMin) return; //saldo insuficiente

    console.log(`\n${colores.juegos}${this.jugador.getNombre()}, estás jugando ${this.nombre}${colores.neutro}`);
    this.jugador.modificarSaldo(-apuesta);
    console.log(this.jugador.monederoToString());

    this.jugarCrupier();
    this.repartirJugador();

    this.turnoJugador();

    if (this.validarResultado()) {
      this.pagar(apuesta);
    }
  }

  private solicitarApuesta(): number {
    return rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}, dispones de $${this.jugador.getMonedero()} para jugar): $`);
  }

  private validarApuesta(apuesta: number): void {
    if (!super.jugadorApto(this.jugador.getMonedero(), apuesta)) {
      throw new ApuestaExcesivaError();
    }
    if (!super.leAlcanzaParaJugar(apuesta)) {
      throw new ApuestaInferiorError();
    }
  }

  private pedirApuesta(): number {
    try {
      const apuesta = this.solicitarApuesta();
      this.validarApuesta(apuesta);
      return apuesta;
    } catch (error) {
      if (error instanceof ApuestaInferiorError) {
        console.error(`${(error as ApuestaInferiorError).message}\n`);
        return this.pedirApuesta();
      }
      if (error instanceof ApuestaExcesivaError) {
        console.error(`${(error as ApuestaExcesivaError).message}\n`);
        return 0;
      }
      console.error((error as Error).message);
      return 0;
    }
  }

  private jugarCrupier(): void {
    while (this.puntajeCrupier < this.MIN_PUNTOS_CRUPIER) {
      this.repartir(true);
    }
    this.mostrarCartas(this.cartasCrupier, 1, this.cartasCrupier.length, true, true);
  }

  private repartirJugador(): void {
    this.repartir(false);
    this.repartir(false);
  }

  private turnoJugador(): void {
    while (this.puedePedir) {
      this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);

      if (this.pedirORetirarse() === 1) {
        if (this.puedePedir) {
          this.repartir(false);
          if (this.puntajeJugador > this.MAX_PUNTOS) {
            this.puedePedir = false;
          }
        }
      } else {
        this.plantarse();
      }
    }
  }

  private repartir(alCrupier: boolean): void {
    const carta: Carta = this.obtenerCartaAleatoria(); //carta oculta
    if (alCrupier) {
      this.puntajeCrupier += carta.getValorNumerico();
      this.cartasCrupier.push(carta);
      if (this.esAs(carta)) this.cantAsesCrupier++; //si es un as, lo anoto
      this.reducirAses(true); //con true es para crupier
    }
    else {
      this.puntajeJugador += carta.getValorNumerico();
      this.cartasJugador.push(carta);
      if (this.esAs(carta)) this.cantAsesJugador++; //si es un as, lo anoto
      this.reducirAses(false); //false para jugador
      if (this.puntajeJugador === this.MAX_PUNTOS) {
        console.log(`Tiene ${this.MAX_PUNTOS} puntos! → Validación de resultado automática...`)
        this.plantarse(); //BLACKJACK!
      }
    }
  }

  private mostrarCartas(cartas: Carta[], desde: number, hasta: number, esCrupier: boolean, ocultarLaPrimera: boolean): void {
    this.reducirAses(true); //con true es para crupier
    this.reducirAses(false); //false para jugador

    let mano: string;
    mano = ocultarLaPrimera ? `${colores.cartaOculta}▒▒▒?▒▒▒${colores.neutro} ` : ``;
    for (let i = desde; i < hasta; i++) {
      const carta:Carta = cartas[i];
      const palo:string = carta.getPalo();
      const valor:string = carta.getValor().padStart(2,` `);
      const esRoja:boolean = [`♥️`,`♦️`].includes(palo);
      mano += `${esRoja?colores.cartaPaloRojo:colores.cartaPaloNegro} ${palo}  ${valor} ${colores.neutro} `
    }
    let deQuienEsLaMano: string = ``;
    deQuienEsLaMano = esCrupier ? `Crupier:` : `Jugador:`;
    console.log(`\n${colores.juegos}${deQuienEsLaMano}${colores.neutro}`, mano);
  }

  private esAs(carta: Carta): boolean {
    return carta.getValor() === `A`;
  }

  private reducirAses(esCrupier: boolean): void {
    if (esCrupier) {
      while (this.puntajeCrupier > 21 && this.cantAsesCrupier > 0) {
        this.puntajeCrupier -= 10;
        this.cantAsesCrupier -= 1;
      }
    } else {
      while (this.puntajeJugador > 21 && this.cantAsesJugador > 0) {
        this.puntajeJugador -= 10;
        this.cantAsesJugador -= 1;
      }
    }
  }

  private pedirORetirarse(): number {
    console.log(`\nTenes ${this.puntajeJugador} puntos. ¿Pedis otra carta o te plantas? `);
    let opcElegida: number;
    do {
      opcElegida = rdl.questionInt(`\t${colores.opcionesMenu}1 Pedir otra\n\t2 Plantarme${colores.neutro}\nElija la opcion: `);
    } while (opcElegida < 1 || opcElegida > 2)
    return opcElegida;
  }

  private plantarse(): void {
    this.puedePedir = false;
    console.clear();
    console.log(`Veamos cómo te fue:`);
  }

  private validarResultado(): boolean {
    const gana: string = 'Ganaste!';
    const pierde: string = 'Perdiste!';
    const empata: string = 'Empataste! (La casa gana)';
    this.reducirAses(true); //con true es para crupier
    this.reducirAses(false); //false para jugador
    this.mostrarCartas(this.cartasCrupier, 0, this.cartasCrupier.length, true, false);
    this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);

    //condiciones de victoria

    const jugadorSePasa = this.puntajeJugador > this.MAX_PUNTOS;
    const crupierSePasa = this.puntajeCrupier > this.MAX_PUNTOS;

    let resultado: string = '';
    let color: string = '';
    if (jugadorSePasa) {
      resultado = pierde
      color = colores.saldoCeroSinFondo;
    } else if (crupierSePasa) {
      resultado = gana;
      color = colores.saldoPositivoSinFondo;
    } else if (this.puntajeJugador > this.puntajeCrupier) {
      resultado = gana;
      color = colores.saldoPositivoSinFondo;
    } else if (this.puntajeJugador < this.puntajeCrupier) {
      resultado = pierde;
      color = colores.saldoCeroSinFondo;
    } else {
      resultado = empata;
      color = colores.saldoCeroSinFondo;
    }
    let puntajes: string = `\n\t→ Crupier ${this.puntajeCrupier}\n\t→ Vos: ${this.puntajeJugador}\n`
    console.log(`${color}\n${resultado} ${puntajes} ${colores.neutro}`);
    if (resultado === gana) return true
    else return false
  }

  public pagar(apuesta: number): void {
    let ganancia: number = (apuesta * this.pagoGanador) + apuesta;
    this.jugador.modificarSaldo(ganancia);
    console.log(`${colores.saldoPositivoSinFondo}👑💎Apostaste $${apuesta} y ganaste $${ganancia} 🥳💸${colores.neutro}`);
    console.log(this.jugador.monederoToString());
  }

}
