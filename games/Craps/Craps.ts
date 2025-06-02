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

  verSiEsPase(sumaDados: number): string{
    if (sumaDados === 7 || sumaDados === 11) return "gana";
    if (sumaDados === 2 || sumaDados === 3 || sumaDados === 12) return "pierde";
    return "punto";
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

  jugar(jugador:Jugador): void {
    console.log(`Hola ${jugador.getNombre()}, estas por jugar ${this.nombre} `);
    let apuesta: number = rdl.questionInt("\nCuanto dinero deseas apostar?: $")
    if(super.jugadorApto(jugador.getMonedero(),apuesta)){
        if(apuesta >= this.apuestaMin){
          jugador.modificarSaldo((-1)*apuesta);
          let punto: number | null = null;
          let sumaDados: number = this.tirarDosDados();
          let resultado: string = this.verSiEsPase(sumaDados);
          if (resultado === "punto") {
            punto = sumaDados;
            console.log(`El punto es ${punto}`);
          }else {
            console.log(`La tirada inicial es ${sumaDados}.  ${resultado}`);
            if (resultado === "gana") {
              this.pagar(apuesta, jugador);
            }
            console.log(`${jugador.toString()}\n`);
            return;
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
              console.log("\n",jugador.toString());
              break;
            }
            if (resultado === "pierde") {
              console.log(`\n-----------------\nSale un 7. Pierde.\n-----------------`);
              console.log("\n",jugador.toString());
              break;
            }
          }
      }else{
        console.log(`La apuesta que deseas hacer no supera la apuesta minima para este juego, la apuesta minima es de $${this.apuestaMin}\n`);
        this.jugar(jugador);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  pagar(apuesta:number, jugador: Jugador): void {
    jugador.modificarSaldo((apuesta * this.pagoGanador) + apuesta);

  }
}