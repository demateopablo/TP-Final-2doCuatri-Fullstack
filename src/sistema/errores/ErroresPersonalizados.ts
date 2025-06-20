import { colores } from '../configColores'

export class SaldoInsuficienteError extends Error {
  constructor() {
    super(`${colores.error} El saldo es insuficiente. ${colores.neutro}`);
    this.name = "SaldoInsuficienteError";
  }
}

export class ApuestaInferiorError extends Error {
  constructor() {
    super(`${colores.error} La apuesta es inferior al minimo aceptado por este juego. ${colores.neutro}`);
    this.name = "ApuestaInferiorError";
  }
}

export class ApuestaExcesivaError extends Error {
  constructor() {
    super(`${colores.error} La apuesta excede el monto disponible. ${colores.neutro}`);
    this.name = "ApuestaExcesiva";
  }
}

export class OpcionInvalidaError extends Error {
  constructor() {
    super(`${colores.error} La opción ingresada es inválida. ${colores.neutro}`);
    this.name = "OpcionInvalidaError";
  }
}

export class SaldoNegativoError extends Error {
  constructor() {
    super(`${colores.error} El saldo a cargar debe ser mayor a cero. ${colores.neutro}`);
    this.name = "SaldoNegativoError";
  }
}

export class EdadInsuficienteError extends Error {
  constructor() {
    super(`${colores.error} Debe ser mayor de edad. ${colores.neutro}`);
    this.name = "EdadInsuficiente";
  }
}