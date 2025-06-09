import { Juego } from '../../Juego'
import { Jugador } from '../../Jugador'
import { Carta } from './Carta'
import * as rdl from 'readline-sync';
import { GeneradorNumeroAleatorio } from '../../GeneradorNumeroAleatorio';

//Objetivo del juego:
// El objetivo del Black Jack es que el jugador obtenga una suma de cartas lo más cercana posible a 21 sin pasarse, y ganarle al crupier.
//Cartas:
//Cartas del 2 al 10 → valen su número.
//J, Q y K → valen 10.
//As (A) → vale 1 o 11, según convenga para no pasarse de 21.

export class Blackjack extends Juego {
    private MAX_PUNTOS: number = 21;
    private MAZO: Carta[];
    private puntajeJugador: number;
    private puntajeCrupier: number;
    private cartasJugador: Carta[];
    private cartasCrupier: Carta[];
    private cantAsesJugador: number;
    private cantAsesCrupier: number;
    private puedePedir: boolean;
    private pagoGanador: number = 1.5;
    private jugador!:Jugador;

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
            const j:number = new GeneradorNumeroAleatorio(0, i + 1).generarNumeroAleatorio();
            [this.MAZO[i], this.MAZO[j]] = [this.MAZO[j], this.MAZO[i]];
        }
    }
    private obtenerCartaAleatoria(): Carta {
        return this.MAZO.pop()!;
        //el ! al final es para asegurarle a typescript que nunca va a ser undefined. (Con un solo jugador en el blackjack no pasaria nunca)
    }

    jugar(jugador: Jugador): void {
        this.reiniciarPartida();
        let apuesta: number = rdl.questionInt(`Cuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
        if (super.jugadorApto(jugador.getMonedero(), apuesta)) {
            if (super.leAlcanzaParaJugar(apuesta)) {
                jugador.modificarSaldo((-1) * apuesta);
                console.log(jugador.monederoToString());
                console.log(`${jugador.getNombre()}, estas jugando Blackjack\n`);
                //reparto cartas al crupier hasta llegar a 17 puntos o más
                while (this.puntajeCrupier < 17) {
                    this.repartir(true)
                }
                this.mostrarCartas(this.cartasCrupier, 1, this.cartasCrupier.length, true, true);
                //reparto dos cartas al jugador
                this.repartir(false);
                this.repartir(false);
                while (this.puedePedir) {
                    this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);
                    if (this.pedirORetirarse() === 1) {
                        if (this.puedePedir) {
                            this.repartir(false);
                            if (this.puntajeJugador > this.MAX_PUNTOS) {
                                this.puedePedir = false;
                            }
                        }
                    }
                    else this.plantarse();
                }
                const gano = this.validarResultado();
                if (gano) this.pagar(apuesta, jugador);
            } else {
                console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
                this.jugar(jugador);
            }
        } else {
            console.log("No posees dinero suficiente");
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
        }
    }

    private mostrarCartas(cartas: Carta[], desde: number, hasta: number, esCrupier: boolean, ocultarLaPrimera: boolean): void {
        this.reducirAses(true); //con true es para crupier
        this.reducirAses(false); //false para jugador

        let mano: string;
        mano = ocultarLaPrimera ? '[ ? ] ' : '';
        for (let i = desde; i < hasta; i++) {
            mano += `[${cartas[i].getPalo()}  ${cartas[i].getValor()}] `
        }
        let deQuienEsLaMano: string = '';
        deQuienEsLaMano = esCrupier ? 'Crupier:' : 'Jugador:';
        console.log(deQuienEsLaMano, mano);
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
        console.log(`Tenes ${this.puntajeJugador} puntos. ¿Pedis otra carta o te plantas? `);
        let opcElegida: number;
        do {
            opcElegida = rdl.questionInt(`\t1 Pedir otra\n\t2 Plantarme\nElija la opcion: `);
        } while (opcElegida < 1 || opcElegida > 2)
        return opcElegida;
    }

    private plantarse(): void {
        this.puedePedir = false;
        console.clear();
        console.log(`Te retiraste, veamos cómo te fue:`);
    }

    private validarResultado(): boolean {
        const gana:string = 'Ganaste!';
        const pierde:string = 'Perdiste!';
        const empata:string = 'Empataste!';
        this.reducirAses(true); //con true es para crupier
        this.reducirAses(false); //false para jugador
        this.mostrarCartas(this.cartasCrupier, 0, this.cartasCrupier.length, true, false);
        this.mostrarCartas(this.cartasJugador, 0, this.cartasJugador.length, false, false);

        //condiciones de victoria

        const jugadorSePasa = this.puntajeJugador > this.MAX_PUNTOS;
        const crupierSePasa = this.puntajeCrupier > this.MAX_PUNTOS;

        let resultado: string = '';

        if (jugadorSePasa) {
            resultado = pierde
        } else if (crupierSePasa) {
            resultado = gana;
        } else if (this.puntajeJugador > this.puntajeCrupier) {
            resultado = gana;
        } else if (this.puntajeJugador < this.puntajeCrupier) {
            resultado = pierde;
        } else {
            resultado = empata;
        }
        let puntajes: string = `\n→ Crupier ${this.puntajeCrupier}\n→ Vos: ${this.puntajeJugador}`
        console.log(`\x1b[31m${resultado} \x1b[33m ${puntajes} \x1b[0m`);
        if (resultado === gana) return true
        else return false
    }

    pagar(apuesta: number, jugador: Jugador): void {
        let ganancia: number = (apuesta * this.pagoGanador) + apuesta;
        jugador.modificarSaldo(ganancia);
        console.log(`\x1b[35m👑💎Apostaste ${apuesta} y ganaste $${ganancia} 🥳💸\x1b[0m`);
        console.log(jugador.monederoToString());
    }

}
