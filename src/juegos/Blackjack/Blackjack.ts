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

  private mostrarInstrucciones(): void {
    console.log(`~~ ${colores.opcionesMenu}${this.jugador.getNombre()}, bienvenido al 🃏 ${this.nombre} 🃏~~\n\n${colores.saludo }Objetivo: acercarse lo más posible a 21 sin pasarse.\nCada carta tiene un valor. Si se pasa de 21, pierde.\n\nOpciones durante el juego:\n\t👉 'Pedir' para robar una carta\n\t✋ 'Plantarse' para quedarte con tu mano\n\n🏆 Gana quien esté más cerca de 21 sin pasarse.\n🟥 En caso de empate, la casa gana.${colores.neutro}\n─────────────────────────────────────────────
`);
  }

  public jugar(jugador: Jugador): void {
    this.jugador = jugador;
    this.reiniciarPartida();
    this.mostrarInstrucciones();
    const apuesta = this.pedirApuesta();
    if (apuesta < this.apuestaMin) return; //saldo insuficiente
    this.jugador.modificarSaldo(-apuesta);
    console.log(this.jugador.monederoToString());

    this.jugarCrupier();
    this.repartirJugador();

    this.turnoJugador();

    if (this.procesarResultado()) {
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
      console.clear();
      this.mostrarCartas(this.cartasCrupier, 1, this.cartasCrupier.length, true, true);
      this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);

      if (this.continuarJugando()) {
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
    console.clear();
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
    mano = ocultarLaPrimera ? `${colores.fondoBlanco}   ?   ${colores.neutro} ` : ``;
    for (let i = desde; i < hasta; i++) {
      const carta: Carta = cartas[i];
      const palo: string = carta.getPalo();
      const valor: string = carta.getValor().padStart(2, ` `);
      const esRoja: boolean = [`♥️`, `♦️`].includes(palo);
      mano += `${esRoja ? colores.cartaPaloRojo : colores.cartaPaloNegro} ${palo}  ${valor} ${colores.neutro} `
    }
    const cantCartas: number = cartas.length;
    let blank: string = ``;
    for (let i = 0; i < cantCartas; i++) {
      blank += `${colores.fondoBlanco}       ${colores.neutro} `;
    }
    let deQuienEsLaMano: string = ``;
    deQuienEsLaMano = esCrupier ? `Crupier:` : `Jugador:`;
    console.log(`${colores.juegos}${deQuienEsLaMano}${colores.neutro}`);
    console.log(`\n${blank}`)
    console.log(mano)
    console.log(`${blank}\n`)
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

  private continuarJugando(): boolean {
    console.log(`\n${this.puntajeJugador < this.MIN_PUNTOS_CRUPIER ? colores.saldoPositivo : colores.saldoCero}Tu puntaje actual es ${this.puntajeJugador} puntos.${colores.neutro} ¿Pedis otra carta o te plantas? `);
    let opcElegida: number;
    do {
      opcElegida = rdl.questionInt(`\t${colores.opcionesMenu}1 Pedir otra\n\t2 Plantarme${colores.neutro}\nElija la opcion: `);
    } while (opcElegida < 1 || opcElegida > 2)
    console.log(``)
    if (opcElegida === 1) return true
    else return false
  }

  private plantarse(): void {
    this.puedePedir = false;
    /* console.clear(); */
    console.log(`Veamos cómo te fue:`);
  }

  private ganoJugador(): boolean {
    const jugadorSePasa: boolean = this.puntajeJugador > this.MAX_PUNTOS;
    const crupierSePasa: boolean = this.puntajeCrupier > this.MAX_PUNTOS;

    if (jugadorSePasa) return false;
    if (crupierSePasa) return true;
    if (this.puntajeJugador > this.puntajeCrupier) return true;
    return false; // pierde o empata
  }

  private prepararEstadoFinalPartida(): void {
    this.reducirAses(true); // Crupier
    this.reducirAses(false); // Jugador
    this.mostrarCartas(this.cartasCrupier, 0, this.cartasCrupier.length, true, false);
    this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);
  }

  private mostrarResultadoFinal(gano: boolean): void {
    let mensaje: string = '';
    let color: string = '';

    const empate: boolean = this.puntajeJugador === this.puntajeCrupier;

    if (gano) {
      mensaje = 'Ganaste!';
      color = colores.saldoPositivoSinFondo;
    } else if (empate) {
      mensaje = 'Empataste! (La casa gana)';
      color = colores.saldoCeroSinFondo;
    } else {
      mensaje = 'Perdiste!';
      color = colores.saldoCeroSinFondo;
    }

    const puntajes = `\n\t→ Crupier ${this.puntajeCrupier}\n\t→ Vos: ${this.puntajeJugador}\n`;
    console.log(`${color}\n${mensaje} ${puntajes} ${colores.neutro}`);
  }

  private procesarResultado(): boolean {
    this.prepararEstadoFinalPartida();
    const gano: boolean = this.ganoJugador();
    this.mostrarResultadoFinal(gano);
    return gano;
  }

  public pagar(apuesta: number): void {
    let ganancia: number = (apuesta * this.pagoGanador) + apuesta;
    this.jugador.modificarSaldo(ganancia);
    console.log(`${colores.saldoPositivoSinFondo}👑💎Apostaste $${apuesta} y ganaste $${ganancia} 🥳💸${colores.neutro}`);
    console.log(this.jugador.monederoToString());
  }

}
