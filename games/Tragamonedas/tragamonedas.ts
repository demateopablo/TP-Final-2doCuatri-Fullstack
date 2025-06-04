import { generadorNumeroAleatorio } from "../../generadorNumeroAleatorio";
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";

export abstract class Tragamonedas extends Juego {
  protected rodillo: string[];
  protected matrizRodillos: string[][] = [];
  protected cantRodillos: number;
  protected cantLineas: number;
  protected nrosAleatorios: generadorNumeroAleatorio;

  constructor(cantRodillos: number, cantLineas: number, rodillo: string[]) {
    super(`Tragamonedas ${cantRodillos}`, 50)
    this.rodillo = rodillo;
    // this.matrizRodillos = [];
    this.crearMatriz(cantRodillos,cantLineas);
    // this.matrizRodillos = Array.from({ length: cantRodillos }, () => Array(cantRodillos).fill(0));
    this.cantRodillos = cantRodillos;
    this.cantLineas = cantLineas;
    this.nrosAleatorios = new generadorNumeroAleatorio(0, rodillo.length - 1)
    // this.agregarRodillos(rodillo);
  }

  crearMatriz(rod:number, lin:number){
    for (let i = 0; i < lin; i++) {
      this.matrizRodillos[i] = [];
      for (let j = 0; j < rod; j++) {
        this.matrizRodillos[i][j] = '';
      }
    }
  }


  jugar(jugador: Jugador):void{

  }

  abstract pagar(apuesta: number, jugador: Jugador): void
}