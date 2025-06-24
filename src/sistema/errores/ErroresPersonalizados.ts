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

export class JuegoInexistenteError extends Error {
  constructor(nombreJuego:string) {
    super(`${colores.error} Ocurrió un error al inicializar el juego "${nombreJuego}". ${colores.neutro}`);
    this.name = "JuegoInexistenteError";
  }
}

export class SaldoNegativoError extends Error {
  constructor() {
    super(`${colores.error} El saldo a cargar debe ser mayor a cero. ${colores.neutro}`);
    this.name = "SaldoNegativoError";
  }
}

export class InstanciaExistenteError extends Error {
  constructor() {
    super(`${colores.error} La instancia ya existe. ${colores.neutro}`);
    this.name = "InstanciaExistente";
  }
}

export class EdadInsuficienteError extends Error {
  constructor(edad:number) {
    super(`${colores.error} Se deben tener al menos ${edad} años de edad para acceder. ${colores.neutro}`);
    this.name = "EdadInsuficiente";
  }
}

export class EdadMenorACeroError extends Error {
  constructor() {
    super(`${colores.error} ¿Todavía no naciste y ya querés entrar a timbear?. ¡Pará un poco! ${colores.neutro}`);
    this.name = "EdadMenorACero";
  }
}

export class EdadMayorAlLimiteError extends Error {
  constructor() {
    super(`${colores.error} La casa se reserva el derecho de admisión, por riesgo de bobazo. ¡Cuida tu salud! ${colores.neutro}`);
    this.name = "EdadMayorAlLimite";
  }
}