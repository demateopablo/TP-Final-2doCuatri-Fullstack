import { Juego } from "../../Juego";
import { Jugador } from "../../Jugador";
import { Dado } from "./Dado";

export class Craps extends Juego{
  private dado1: Dado;
  private dado2: Dado;

  constructor(nombre: string, apuestaMin:number){
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
    if(super.jugadorApto(jugador.monedero)){
      let punto: number | null = null;
      let sumaDados = this.dado1.arrojarDado() + this.dado2.arrojarDado();
      let resultado = this.verSiEsPase(sumaDados);

      if (resultado === "punto") {
        punto = sumaDados;
        console.log(`El punto es ${punto}`);
      }else {
        console.log(`La tirada inicial es ${sumaDados}.  ${resultado}`);
        return;
      }

      while (true) {
        sumaDados = this.dado1.arrojarDado() + this.dado2.arrojarDado();
        resultado = this.verSiEsPunto(sumaDados, punto!);
        if (resultado === "gana") {
          console.log(`El punto ${punto} sale. Gana.`);
          break;
        }
        if (resultado === "pierde") {
          console.log(`Sale un 7. Pierde.`);
          break;
        }
      }
    }else{
      console.log("No posee dinero suficiente");
      
    }
  }

  pagar(pPago:number): number {
    let montoAPagar: number = pPago;

    return montoAPagar;
  }
}