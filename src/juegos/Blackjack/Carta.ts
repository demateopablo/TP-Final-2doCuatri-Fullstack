export class Carta {
    private valor: string;
    private palo: string;

    constructor(valor: string, palo: string) {
        this.valor = valor;
        this.palo = palo;
    }

    public getValor(): string {
        return this.valor;
    }

    public getPalo(): string {
        return this.palo;
    }

    public toString(): string {
        return `${this.valor} de ${this.palo}`;
    }

    public getValorNumerico(): number {
        if (this.valor === 'J' || this.valor === 'Q' || this.valor === 'K') {
            return 10; // J, Q y K valen 10
        }
        if (this.valor === 'A') {
            return 11; // El As puede valer 11 o 1, según convenga
        } else {
            return parseInt(this.valor); //2 a 10
        }
    }
}