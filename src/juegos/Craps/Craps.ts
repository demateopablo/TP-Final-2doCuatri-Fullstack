import * as rdl from 'readline-sync';
import { Juego } from "../../entidades/Juego";
import { Jugador } from "../../entidades/Jugador";
import { Dado } from "./Dado";
import { OpcionInvalida, SaldoInsuficienteError, ApuestaInferiorError } from '../../sistema/errores/ErroresPersonalizados';

export class Craps extends Juego {
  private pagoGanador: number = 1; // paga 1:1
  private dado: Dado;

  constructor() {
    super("Craps", 1000);
    this.dado = new Dado(6);
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
            apuesta = rdl.questionInt(`\nCuanto dinero deseas apostar? (apuesta minima $${this.apuestaMin}): $`);
            if (super.leAlcanzaParaJugar(apuesta)) {
              try {
                if (apuesta <= this.jugador.getMonedero()) {
                  this.jugador.modificarSaldo((-1) * apuesta);
                  return apuesta;
                } else {
                  throw new SaldoInsuficienteError();
                }
              } catch (error) {
                console.error((error as ApuestaInferiorError).message);
                return 0
              }
            } else {
              throw new SaldoInsuficienteError();
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


  private logicaScraps(apuesta: number) {
    let opcApuestaInicial: number
    try {
      opcApuestaInicial = rdl.questionInt("\nSeleccion con que modo de juego quiere iniciar la partida\n\t1 - Pass Line\n\t2 - Don't Pass Bar\n");
      if (opcApuestaInicial > 0 && opcApuestaInicial < 3) {
        console.log("-------------🎲🎲🎲------------ Que comience el juego -------------🎲🎲🎲------------");
        let sumaDados: number = this.tirarDosDados();
        switch (opcApuestaInicial) {
          case 1:
            if (this.verSiEsWin(sumaDados)) {
              console.log(`\n-------------------------------------------------------\n\t🍀 La tirada inicial es ${sumaDados}.  GANA!!! 🤑\n-------------------------------------------------------`);
              this.pagar(apuesta);
              console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            } else if (this.verSiEsCrap(sumaDados)) {
              console.log(`\n-------------------------------------------------------\n\t👎 La tirada inicial es ${sumaDados}.  PIERDE!!! 😞\n-------------------------------------------------------`);
              console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            } else {
              this.seguirTirando(opcApuestaInicial, sumaDados, apuesta)
            }
            break;
          case 2:
            if (this.verSiEsCrap(sumaDados)) {
              console.log(`\n-------------------------------------------------------\n\t🍀 La tirada inicial es ${sumaDados}.  GANA!!! 🤑\n-------------------------------------------------------`);
              this.pagar(apuesta);
              console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            } else if (this.verSiEsWin(sumaDados)) {
              console.log(`\n-------------------------------------------------------\n\t👎 La tirada inicial es ${sumaDados}.  PIERDE!!! 😞\n-------------------------------------------------------`);
              console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            } else {
              this.seguirTirando(opcApuestaInicial, sumaDados, apuesta)
            }
            break;
          default:
            break;
        }
      } else {
        throw new OpcionInvalida();
      }
    } catch (error) {
      console.error((error as OpcionInvalida).message);
      this.logicaScraps(apuesta);
    }
  }

  private seguirTirando(opcApuestaInicial: number, punto: number, apuesta: number) {
    let contador: number = 0;
    let sumaDados: number;
    console.log(`\t→ El punto es ${punto}`);
    while (true) {
      contador++;
      sumaDados = this.tirarDosDados();
      console.log(`Tirada ${contador} sale ${sumaDados}\t→ Recuerde, el punto es ${punto}`);
      if (opcApuestaInicial === 1) {
        if (sumaDados === punto) {
          console.log(`\n-------------------------------------------------\n\t🍀 El punto ${punto} sale. GANA!!! 🤑\n-------------------------------------------------`);
          this.pagar(apuesta);
          console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
          break;
        } else {
          if (sumaDados === 7) {
            console.log(`\n-------------------------------------------------\n\t👎 Sale un 7. Usted PIERDE!!! 😞\n-------------------------------------------------`);
            console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            break;
          }
        }
      }
      if (opcApuestaInicial === 2) {
        if (sumaDados === 7) {
          console.log(`\n-------------------------------------------------\n\t\t🍀 Sale un 7. sale. GANA!!! 🤑\n-------------------------------------------------`);
          this.pagar(apuesta);
          console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
          break;
        } else {
          if (sumaDados === punto) {
            console.log(`\n-------------------------------------------------\n\t\t👎 El punto ${punto} sale. Usted PIERDE!!! 😞\n-------------------------------------------------`);
            console.log(`\n\n--------------------------------------\nSu saldo actual es de 💲${this.jugador.getMonedero()}\n--------------------------------------\n`);
            break;
          }
        }
      }
    }
  }

  pagar(apuesta: number): void {
    this.jugador.modificarSaldo((apuesta * this.pagoGanador) + apuesta);
  }
}