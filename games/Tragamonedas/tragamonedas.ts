import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";

export class TragaMonedas extends Juego{

    constructor(){
        super("Tragamonedas", 1000)
    }

    jugar(jugador: Jugador): void {
        throw new Error("Method not implemented.");
    }
    pagar(apuesta: number, jugador: Jugador): void {
        throw new Error("Method not implemented.");
    }
    
}