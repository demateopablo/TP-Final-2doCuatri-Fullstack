import * as rs from 'readline-sync';
import { Jugador } from './Jugador';
import { Casino } from './Casino';

export class Aplicacion {

    public static instancia: Aplicacion;
    public casino: Casino;
    public jugador: Jugador;

    constructor(pCasino: Casino, pJugador: Jugador) {
        this.casino = pCasino;
        this.jugador = pJugador;
    }

}