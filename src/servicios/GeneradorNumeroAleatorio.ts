export class GeneradorNumeroAleatorio{
  private numeroMin: number;
  private numeroMax: number;

  constructor(min: number, max: number){
    this.numeroMin = Math.min(min, max);
    this.numeroMax = Math.max(min, max);
  }

  generarNumeroAleatorio(){
    return Math.floor(Math.random() * (this.numeroMax - this.numeroMin + 1)) + this.numeroMin;
  }
}
