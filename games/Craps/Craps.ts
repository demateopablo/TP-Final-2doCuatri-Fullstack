import * as rdl from 'readline-sync';
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";
import { Dado } from "./Dado";

export class Craps extends Juego{
  private pagoGanador: number = 1; // paga 1:1
  private dado: Dado;
  private jugador!: Jugador; //se inicializa vacio y se asigna valor al jugar

  constructor(){
    super("Craps",1000);
    this.dado = new Dado(6);
  }

  tirarDosDados(): number{
    let dado1: number = this.dado.arrojarDado();
    let dado2: number = this.dado.arrojarDado();
    console.log(`\n${String.fromCodePoint(this.dado.imprimirCaraDado(dado1))} ${String.fromCodePoint(this.dado.imprimirCaraDado(dado2))}`);
    console.log(`${(dado1)} ${(dado2)}\n`);
    return dado1+dado2;
  }

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

  jugar(jugador:Jugador): void {
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    let apuesta: number = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`)
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
      if(super.leAlcanzaParaJugar(apuesta)){
        jugador.modificarSaldo((-1)*apuesta);
        this.logicaScraps(apuesta)
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.jugar(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  logicaScraps(apuesta: number){
    let opcApuestaInicial: number = rdl.questionInt("\nSeleccion con que modo de juego quiere iniciar la partida\n\t1 - Pass Line\n\t2 - Don't Pass Bar\n");
    console.log("-------------------------------- Que comience el juego --------------------------------");
    let sumaDados: number = this.tirarDosDados();
    if (opcApuestaInicial === 1){ //-------------------------------------------- modo pass line
      if(this.verSiEsWin(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  GANA!!!`);
        this.pagar(apuesta);
        console.log(`${this.jugador.toString()}\n`);
      } else if(this.verSiEsCrap(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  PIERDE!!!`);
        console.log(`${this.jugador.toString()}\n`);
      } else {
        this.seguirTirando(opcApuestaInicial, sumaDados, apuesta)
      }
    }
    if (opcApuestaInicial === 2){ //-------------------------------------------- modo dont pass bar
      if(this.verSiEsCrap(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  GANA!!!`);
        this.pagar(apuesta);
        console.log(`${this.jugador.toString()}\n`);
      } else if(this.verSiEsWin(sumaDados)){
        console.log(`La tirada inicial es ${sumaDados}.  PIERDE!!!`);
        console.log(`${this.jugador.toString()}\n`);
      } else {
        this.seguirTirando(opcApuestaInicial, sumaDados, apuesta)
      }
    }
  }

  seguirTirando(opcApuestaInicial: number, punto: number, apuesta: number){
    let contador: number = 0;
    let sumaDados: number;
    console.log(`\t→ El punto es ${punto}`);
    while (true) {
      contador++;
      sumaDados = this.tirarDosDados();
      console.log(`Tirada ${contador} sale ${sumaDados}\t→ Recuerde, el punto es ${punto}`);
      if (opcApuestaInicial === 1) {
        if (sumaDados === punto) {
          console.log(`\n-----------------\nEl punto ${punto} sale. Gana!!!\n-----------------`);
          this.pagar(apuesta);
          console.log(`${this.jugador.toString()}\n`);
          break;
        } else {
          if (sumaDados === 7) {
            console.log(`\n-----------------\nSale un 7. Usted pierde.\n-----------------`);
            console.log(`${this.jugador.toString()}\n`);
            break;
          }
        }
      }
      if (opcApuestaInicial === 2) {
        if (sumaDados === 7) {
          console.log(`\n-----------------\nSale un 7. sale. Gana!!!\n-----------------`);
          this.pagar(apuesta);
          console.log(`${this.jugador.toString()}\n`);
          break;
        } else {
          if (sumaDados === punto) {
            console.log(`\n-----------------\nEl punto ${punto} sale. Usted pierde.\n-----------------`);
            console.log(`${this.jugador.toString()}\n`);
            break;
          }
        }
      }
    }
  }

  pagar(apuesta:number): void {
    this.jugador.modificarSaldo((apuesta * this.pagoGanador) + apuesta);
  }
}