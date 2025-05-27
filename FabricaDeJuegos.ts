import { Blackjack } from "./games/Blackjack/Blackjack";
import { Craps } from "./games/Craps/Craps";
import { Juego } from "./Juego";

export class FabricaDeJuegos{
    public crear(opcion:string):Juego{

        switch(opcion){
            case "1": return new Craps();
            case "2": return new Blackjack();
            // case "3" :return TragaMonedas3();
            // case "4":return TragaMonedas5();
            // case "5": return new Ruleta();
            default: throw new Error("La opción no es valida");
        }

    }
}