export class generadorNumeroAleatorio{
  private numeroMin: number;
  private numeroMax: number;

  constructor(pMin: number, pMax: number){
    this.numeroMin = pMin;
    this.numeroMax = pMax;
  }

  generarNumeroAleatorio(){
    if (this.numeroMax < this.numeroMin) {
      let aux :number = this.numeroMax;
      this.numeroMax = this.numeroMin;
      this.numeroMin = aux;
    }
    return Math.floor(Math.random() * (this.numeroMax - this.numeroMin + 1)) + this.numeroMin;
  }
}