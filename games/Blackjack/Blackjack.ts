import { Juego } from './Juego.ts'
import { Jugador } from './Jugador.ts'
//Objetivo del juego:
// El objetivo del Black Jack es que el jugador obtenga una suma de cartas lo más cercana posible a 21 sin pasarse, y ganarle al crupier.
//Cartas:
//Cartas del 2 al 10 → valen su número.
//J, Q y K → valen 10.
//As (A) → vale 1 o 11, según convenga para no pasarse de 21.

export class Blackjack extends Juego {
    private static MAX_PUNTOS: number = 21;
    private CARTAS: number[];
    private puntajeUsuario: number;
    private puntajeCrupier: number;

    constructor() {
        super(`Blackjack`, 150);
        this.puntajeUsuario = 0;
        this.puntajeCrupier = 0;
        this.CARTAS = [
            2, 2, 2, 2,
            3, 3, 3, 3,
            4, 4, 4, 4,
            5, 5, 5, 5,
            6, 6, 6, 6,
            7, 7, 7, 7,
            8, 8, 8, 8,
            9, 9, 9, 9,
            10, 10, 10, 10,
            10, 10, 10, 10,//J
            10, 10, 10, 10,//Q
            10, 10, 10, 10,//K
            11, 11, 11, 11//A → El As vale 11 o 1, segun convenga para no pasarse de 21
            //Ver si me conviene tener numeros o strings con las cartas con valores y letras...
            //capaz para validar el as es mas facil con strings y darle el valor que corresponda
        ]
    }
    repartirCarta(): number {
        const totalCartas: number = this.CARTAS.length;
        const posicionCarta: number = Math.floor(Math.random() * totalCartas);
        const carta = this.CARTAS[posicionCarta];
        this.CARTAS.splice(posicionCarta, 1);
        return carta;
    }

    jugar(jugador: Jugador): void {
        const cartasJugador: number[] = [];
        const cartasCrupier: number[] = [];
        let sumaJugador: number = 0;
        let sumaCrupier: number = 0;
        cartasJugador.push(this.repartirCarta());
        cartasJugador.push(this.repartirCarta());
        cartasCrupier.push(this.repartirCarta());
        cartasCrupier.push(this.repartirCarta());
    }

    pagar(): number {
        return 1;
    }

}
