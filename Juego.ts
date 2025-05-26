import { IJuego } from './IJuego';
import { Jugador } from './Jugador';

export abstract class Juego implements IJuego{
    nombre:string;
    apuestaMinima:Number;

    constructor(pNombre:string,pApuestaMinima:number){
        this.nombre=pNombre;
        this.apuestaMinima=pApuestaMinima;
    }

    abstract jugar(jugador: Jugador): void;
    abstract pagar(): number;
}