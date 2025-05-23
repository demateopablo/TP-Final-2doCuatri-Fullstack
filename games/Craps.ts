import { IJuego } from "../IJuego";
import { Jugador } from "../Jugador";

export class Craps implements IJuego{
  private player: Jugador;


  lanzarDados(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  lanzarDosDados(): number {
      return this.lanzarDados() + this.lanzarDados();
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

  jugar(): void {
    let punto: number | null = null;
    let sumaDados = this.lanzarDosDados();
    let resultado = this.verSiEsPase(sumaDados);

    if (resultado === "punto") {
      punto = sumaDados;
      console.log(`El punto es ${punto}`);
    }else {
      console.log(`La tirada inicial es ${sumaDados}.  ${resultado}`);
      return;
    }

    while (true) {
      sumaDados = this.lanzarDosDados();
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
  }

  pagar(): void {
    
  }
}