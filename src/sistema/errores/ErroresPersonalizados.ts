export class SaldoInsuficienteError extends Error {
  constructor() {
    super(`El saldo es insuficiente.`);
    this.name = "SaldoInsuficienteError";
  }
}

export class ApuestaInferiorError extends Error {
  constructor() {
    super(`La apuesta es inferior al minimo aceptado por este juego.`);
    this.name = "ApuestaInferiorError";
  }
}

export class ApuestaExcesivaError extends Error {
  constructor() {
    super(`La apuesta excede el monto disponible.`);
    this.name = "ApuestaExcesiva";
  }
}

export class OpcionInvalida extends Error {
  constructor() {
    super(`La opción ingresada es inválida.`);
    this.name = "OpcionInvalidaError";
  }
}

export class SaldoNegativoError extends Error {
  constructor() {
    super(`El saldo a cargar debe ser mayor a cero.`);
    this.name = "SaldoNegativoError";
  }
}