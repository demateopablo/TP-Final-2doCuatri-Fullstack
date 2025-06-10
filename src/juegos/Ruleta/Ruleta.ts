import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";

export class Ruleta extends Juego{

    constructor(){
        super("Ruleta", 1000)
    }

    jugar(jugador: Jugador): void {
        throw new Error("Method not implemented.");
    }
    pagar(apuesta: number, jugador: Jugador): void {
        throw new Error("Method not implemented.");
    }
    
}