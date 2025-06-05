import * as rdl from 'readline-sync';
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
    this.crearMatriz(cantRodillos,cantLineas);
    this.cantRodillos = cantRodillos;
    this.cantLineas = cantLineas;
    this.nrosAleatorios = new generadorNumeroAleatorio(0, rodillo.length - 1)
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
    this.girarRodillos();
    this.mostrarEnConsola();
  }

  pedirApuesta(jugador: Jugador): number{
    let apuesta: number = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
      if(apuesta >= this.apuestaMin){
        jugador.modificarSaldo((-1)*apuesta);
        // this.jugar(jugador);
        return apuesta
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.pedirApuesta(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
    return jugador.getMonedero();
  }

  girarRodillos(): void{
    let indice: number;
    for (let i = 0; i < this.cantLineas; i++) {
      for (let j = 0; j < this.cantRodillos; j++) {
        indice = this.nrosAleatorios.generarNumeroAleatorio();
        this.matrizRodillos[i][j] = this.rodillo[indice];
      }
    }
  }

  mostrarEnConsola():void{
    let matrizToString: string = '\n';
    for (let i = 0; i < this.cantLineas; i++) {
      matrizToString += `Linea ${i+1}: |`;
      for (let j = 0; j < this.cantRodillos; j++) {
        matrizToString += ` ${this.matrizRodillos[i][j]} |`;
      }
      matrizToString +="\n";
    }
    console.log(`${matrizToString}`);
  }

  abstract pagar(apuesta: number, jugador: Jugador): void
}