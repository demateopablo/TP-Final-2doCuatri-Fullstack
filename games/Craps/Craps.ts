import * as rdl from 'readline-sync';
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";
import { Dado } from "./Dado";

export class Craps extends Juego{
  private pagoGanador: number = 1; // paga 1:1
  private dado: Dado;

  constructor(){
    super("Craps",1000);
    this.dado = new Dado(6);
  }

  // verSiEsPase(sumaDados: number): string{
  //   if (sumaDados === 7 || sumaDados === 11) return "gana";
  //   if (sumaDados === 2 || sumaDados === 3 || sumaDados === 12) return "pierde";
  //   return "punto";
  // }

  verSiEsWin(sumaDados: number): boolean{
    if (sumaDados === 7 || sumaDados === 11){
      return true;
    }
    return false;
  }

  verSiEsCrap(sumaDados: number): boolean{
    if (sumaDados === 2 || sumaDados === 3 || sumaDados === 12){
      return true;
    }
    return false;
  }

  verSiEsPunto(sumaDados: number, punto: number): string {
    if (sumaDados === punto) return "gana";
    if (sumaDados === 7) return "pierde";
    return "ninguno";
  }

  tirarDosDados(): number{
    let dado1: number = this.dado.arrojarDado();
    let dado2: number = this.dado.arrojarDado();
    console.log(`\n${String.fromCodePoint(this.dado.imprimirCaraDado(dado1))} ${String.fromCodePoint(this.dado.imprimirCaraDado(dado2))}`);
    console.log(`${(dado1)} ${(dado2)}\n`);
    return dado1+dado2;
  }

  logicaScraps(jugador: Jugador, apuesta: number){
    let punto: number | null = null;
    let opcApuestaInicial: number = rdl.questionInt("\nSeleccion con qué modo de juego quiere iniciar la partida\n\t1 - Pass Line\n\t2 - Don't Pass Bar");
    let sumaDados: number = this.tirarDosDados();
    if (opcApuestaInicial === 1){
      if (!this.verSiEsCrap(sumaDados) && !this.verSiEsWin(sumaDados)){
        punto = sumaDados;
        console.log(`El punto es ${punto}`);
      } else if(this.verSiEsWin(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  GANA!!!`);
        this.pagar(apuesta, jugador);
      } else {
        console.log(`La tirada inicial es ${sumaDados}.  PIERDE!!!`);
      }
      this.jugar(jugador);
    }
    if (opcApuestaInicial === 2){
      if (!this.verSiEsCrap(sumaDados) && !this.verSiEsWin(sumaDados)){
        punto = sumaDados;
        console.log(`El punto es ${punto}`);
      } else if(this.verSiEsWin(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  GANA!!!`);
        this.pagar(apuesta, jugador);
      } else {
        console.log(`La tirada inicial es ${sumaDados}.  PIERDE!!!`);
      }
      this.jugar(jugador);
    }
    let contador: number = 0;
    while (true) {
      contador++;
      sumaDados = this.tirarDosDados();
      console.log(`Tirada ${contador} sale ${sumaDados}`);
      resultado = this.verSiEsPunto(sumaDados, punto!);
      if (resultado === "gana") {
        console.log(`\n-----------------\nEl punto ${punto} sale. Gana!!!\n-----------------`);
        this.pagar(apuesta, jugador);
        console.log(jugador.toString());
        break;
      }
      if (resultado === "pierde") {
        console.log(`\n-----------------\nSale un 7. Pierde.\n-----------------`);
        console.log(jugador.toString());
        break;
      }
    }
  }

  jugar(jugador:Jugador): void {
    console.log(`Hola ${jugador.getNombre()}, estas por jugar ${this.nombre} `);
    let apuesta: number = rdl.questionInt("\nCuanto dinero deseas apostar?: $")
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
        if(apuesta >= this.apuestaMin){
          jugador.modificarSaldo((-1)*apuesta);
          
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        jugador.apostar(this);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  pagar(apuesta:number, jugador: Jugador): void {
    jugador.modificarSaldo((apuesta * this.pagoGanador) + apuesta);

  }
}