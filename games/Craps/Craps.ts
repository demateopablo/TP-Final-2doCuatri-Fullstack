import * as rdl from 'readline-sync';
import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";
import { Dado } from "./Dado";

export class Craps extends Juego{
  private pagoGanador: number = 2;
  private dado1: Dado;
  private dado2: Dado;

  constructor(nombre: string, apuestaMin: number){
    super(nombre,apuestaMin);
    this.dado1 = new Dado(6);
    this.dado2 = new Dado(6);
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

  jugar(jugador:Jugador): void {
    if(super.jugadorApto(jugador.getMonedero())){
      console.log(`Hola ${jugador.getNombre()}, estas por jugar ${this.nombre} `);
      let apuesta: number = rdl.questionInt("\nCuanto dinero deseas apostar?: ")
        if(apuesta >= this.apuestaMin){
          jugador.modificarSaldo((-1)*apuesta);
          let punto: number | null = null;
          let sumaDados = this.dado1.arrojarDado() + this.dado2.arrojarDado();
          let resultado = this.verSiEsPase(sumaDados);
          if (resultado === "punto") {
            punto = sumaDados;
            console.log(`El punto es ${punto}`);
          }else {
            console.log(`La tirada inicial es ${sumaDados}.  ${resultado}`);
            if (resultado === "gana") {
              this.pagar(apuesta, jugador);
            }
            console.log(jugador.toString());
            return;
          }
          let contador: number = 0;
          while (true) {
            contador++;
            sumaDados = this.dado1.arrojarDado() + this.dado2.arrojarDado();
            console.log(`Tirada ${contador} sale ${sumaDados}`);
            resultado = this.verSiEsPunto(sumaDados, punto!);
            if (resultado === "gana") {
              console.log(`El punto ${punto} sale. Gana.`);
              this.pagar(apuesta, jugador);
              console.log(jugador.toString());
              break;
            }
            if (resultado === "pierde") {
              console.log(`Sale un 7. Pierde.`);
              console.log(jugador.toString());
              break;
            }
          }
      }else{
        console.log("No dispones de dinero suficiente");
        jugador.apostar(this);
      }
    }else{
      console.log("No posee dinero suficiente");
    }
  }

  //TODO: creo que podriamos hacer el metodo pagar :void y pasar la apuesta por parametro junto con el jugador y modificar desde aca el monedero
  pagar(apuesta:number, jugador: Jugador): void {
    jugador.modificarSaldo((apuesta) + apuesta);
    // console.log(apuesta * this.pagoGanador);
    // return (apuesta * this.pagoGanador);
  }
}