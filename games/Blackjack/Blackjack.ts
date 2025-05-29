import { Juego } from '../../Juego'
import { Jugador } from '../../Jugador'
import { Carta } from './Carta'
import * as rdl from 'readline-sync';

//Objetivo del juego:
// El objetivo del Black Jack es que el jugador obtenga una suma de cartas lo más cercana posible a 21 sin pasarse, y ganarle al crupier.
//Cartas:
//Cartas del 2 al 10 → valen su número.
//J, Q y K → valen 10.
//As (A) → vale 1 o 11, según convenga para no pasarse de 21.

export class Blackjack extends Juego {
    private static MAX_PUNTOS: number = 21;
    private MAZO: Carta[];
    private puntajeUsuario: number;
    private puntajeCrupier: number;

    constructor() {
        super(`Blackjack`, 150);
        this.puntajeUsuario = 0;
        this.puntajeCrupier = 0;
        this.MAZO = this.generarMazo();
        //A → El As vale 11 o 1, segun convenga para no pasarse de 21
        //Ver si me conviene tener numeros o strings con las cartas con valores y letras...
        //capaz para validar el as es mas facil con strings y darle el valor que corresponda
    }

    private generarMazo(): Carta[] {
        const palos: string[] = ['♠', '♥', '♦', '♣'];
        const valores: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const mazo: Carta[] = [];

        palos.forEach((palo) => {
            valores.forEach((valor) => {
                mazo.push(new Carta(valor, palo));
            })
        })
        return mazo;
    }

    repartirCarta(): Carta {
        const totalCartas: number = this.MAZO.length; //52 al inicio
        const posicionCarta: number = Math.floor(Math.random() * totalCartas);
        const carta: Carta = this.MAZO[posicionCarta];
        this.MAZO.splice(posicionCarta, 1);
        return carta;
    }

    jugar(jugador: Jugador): void {
        const cartasJugador: Carta[] = new Array();
        const cartasCrupier: Carta[] = new Array();
        let sumaJugador: number = 0;
        let sumaCrupier: number = 0;
        cartasJugador.push(this.repartirCarta());
        cartasJugador.push(this.repartirCarta());
        cartasCrupier.push(this.repartirCarta());
        cartasCrupier.push(this.repartirCarta());

        //mostrar 2 cartas del jugador y 1 del crupier

    }

    pedirORetirarse(): void {
        console.log(`¿Pedis otra carta o te plantas?`);
        console.log(`1 Pedir otra carta`);
        console.log(`2 Plantarme`);/* 
    let opcElegida: number;
    do {
      opcElegida = rdl.questionInt(mensaje);
    } while (opcElegida < 0 || opcElegida > cantOpciones + 1)
    return opcElegida;
    rdl.questionInt(`Elija una opción`,) 
  }*/

    }

    pagar(apuesta: number, jugador: Jugador): void {
        console.log("Hola");
    }

}
