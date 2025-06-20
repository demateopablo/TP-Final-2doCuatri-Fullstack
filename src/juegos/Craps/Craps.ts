import * as rdl from 'readline-sync';
import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";
import { Dado } from "./Dado";
import { OpcionInvalidaError, SaldoInsuficienteError, ApuestaInferiorError, ApuestaExcesivaError } from '../../sistema/errores/ErroresPersonalizados';
import { colores } from "../../sistema/configColores";

export class Craps extends Juego {
  private pagoGanador: number = 1; // paga 1:1
  private dado: Dado;

  constructor() {
    super("Craps", 1000);
    this.dado = new Dado(6);
  }

  jugar(jugador: Jugador): void {
    this.jugador = jugador; //Inicializamos el jugador en el atributo Jugador de la clase
    console.clear();
    let apuesta: number
    apuesta = this.pedirApuesta();
    if (apuesta < this.apuestaMin) return;
    console.clear();
    this.logicaScraps(apuesta)
  }

  private pedirApuesta(): number {
    let apuesta: number
    do {
      try {
        if (super.jugadorApto(this.jugador.getMonedero(), this.apuestaMin)) {
          try {
            apuesta = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}, dispones de $${this.jugador.getMonedero()} para jugar): $`);
            if (super.leAlcanzaParaJugar(apuesta)) {
              try {
                if (apuesta <= this.jugador.getMonedero()) {
                  this.jugador.modificarSaldo((-1) * apuesta);
                  return apuesta;
                } else {
                  throw new ApuestaExcesivaError();
                }
              } catch (error) {
                console.error((error as ApuestaExcesivaError).message);
                return 0
              }
            } else {
              throw new ApuestaInferiorError();
            }
          } catch (error) {
            console.error((error as ApuestaInferiorError).message);
            return 0
          }
        } else {
          throw new SaldoInsuficienteError();
        }
      } catch (error) {
        console.error((error as SaldoInsuficienteError).message);
        return 0;
      }
    } while (apuesta < this.apuestaMin || apuesta > this.jugador.getMonedero())
  }


  private logicaScraps(apuesta: number): void {
    let opcApuestaInicial: number
    try {
      opcApuestaInicial = rdl.questionInt("\nSeleccion con que modo de juego quiere iniciar la partida\n\t1 - Pass Line\n\t2 - Don't Pass Bar\n");
      if (opcApuestaInicial > 0 && opcApuestaInicial < 3) {
        console.log(`-------------🎲🎲🎲------------ ${colores.juegos}Que comience el juego${colores.neutro} -------------🎲🎲🎲------------`);
        let sumaDados: number = this.tirarDosDados();
        switch (opcApuestaInicial) {
          case 1:
            this.tiradaInicial(this.verSiEsWin(sumaDados), this.verSiEsCrap(sumaDados), sumaDados, apuesta, opcApuestaInicial)
            break;
          case 2:
            this.tiradaInicial(this.verSiEsCrap(sumaDados), this.verSiEsWin(sumaDados), sumaDados, apuesta, opcApuestaInicial, 12)
            break;
          default:
            break;
        }
      } else {
        throw new OpcionInvalidaError();
      }
    } catch (error) {
      console.error((error as OpcionInvalidaError).message);
      this.logicaScraps(apuesta);
    }
  }

  private tiradaInicial(gana: boolean, pierde: boolean, sumaDados: number, apuesta: number, opcApuestaInicial: number, empate?: number): void {
    if (sumaDados == empate) {
      console.log(`\n-------------------------------------------------\n\t👀 Sale un ${empate}. Usted EMPATA!!! 🤷‍♂️\n-------------------------------------------------`);
      this.pagar(apuesta / 2);
      console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.jugador.getMonedero()}${colores.neutro}\n--------------------------------------\n`);
      return;
    }
    if (gana) {
      console.log(`\n-------------------------------------------------------\n\t🍀 La tirada inicial es ${sumaDados}.  ${colores.saldoPositivoSinFondo}GANA!!!${colores.neutro} 🤑\n-------------------------------------------------------`);
      this.pagar(apuesta);
      console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.jugador.getMonedero()}${colores.neutro}\n--------------------------------------\n`);
    } else if (pierde) {
      console.log(`\n-------------------------------------------------------\n\t👎 La tirada inicial es ${sumaDados}.  ${colores.saldoCeroSinFondo}PIERDE!!!${colores.neutro} 😞\n-------------------------------------------------------`);
      console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.jugador.getMonedero()}${colores.neutro}\n--------------------------------------\n`);
    } else {
      this.seguirTirando(opcApuestaInicial, sumaDados, apuesta)
    }
  }

  private seguirTirando(opcApuestaInicial: number, punto: number, apuesta: number): void {
    let fin: boolean = false;
    let contador: number = 0;
    let sumaDados: number;
    console.log(`\t→ El punto es ${punto}`);
    while (!fin) {
      contador++;
      sumaDados = this.tirarDosDados();
      console.log(`Tirada ${contador} sale ${sumaDados}\t→ Recuerde, el punto es ${punto}`);
      switch (opcApuestaInicial) {
        case 1:
          fin = this.tirarHastaFin(punto, 7, sumaDados, apuesta);
          break;
        case 2:
          fin = this.tirarHastaFin(7, punto, sumaDados, apuesta);
          break;
        default:
          break;
      }
    }
  }

  private tirarHastaFin(gana: number, pierde: number, sumaDados: number, apuesta: number): boolean {
    if (sumaDados === gana) {
      console.log(`\n-------------------------------------------------\n\t🍀 El punto ${gana} sale. ${colores.saldoPositivoSinFondo}GANA!!!${colores.neutro} 🤑\n-------------------------------------------------`);
      this.pagar(apuesta);
      console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.jugador.getMonedero()}${colores.neutro}\n--------------------------------------\n`);
      return true;
    } else {
      if (sumaDados === pierde) {
        console.log(`\n-------------------------------------------------\n\t👎 Sale un ${pierde}. Usted ${colores.saldoCeroSinFondo}PIERDE!!!${colores.neutro} 😞\n-------------------------------------------------`);
        console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero() > 0 ? colores.saldoPositivoSinFondo : colores.saldoCeroSinFondo}${this.jugador.getMonedero()}${colores.neutro}\n--------------------------------------\n`);
        return true;
      }
      return false
    }
  }

  private tirarDosDados(): number {
    let dado1: number = this.dado.arrojarDado();
    let dado2: number = this.dado.arrojarDado();
    console.log(`\n${String.fromCodePoint(this.dado.imprimirCaraDado(dado1))} ${String.fromCodePoint(this.dado.imprimirCaraDado(dado2))}`);
    console.log(`${(dado1)} ${(dado2)}\n`);
    return dado1 + dado2;
  }

  private verSiEsWin(sumaDados: number): boolean {
    if (sumaDados === 7 || sumaDados === 11) {
      return true;
    }
    return false;
  }

  private verSiEsCrap(sumaDados: number): boolean {
    if (sumaDados === 2 || sumaDados === 3 || sumaDados === 12) {
      return true;
    }
    return false;
  }

  public pagar(apuesta: number): void {
    this.jugador.modificarSaldo((apuesta * this.pagoGanador) + apuesta);
  }
}