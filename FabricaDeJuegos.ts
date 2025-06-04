import { Blackjack } from "./games/Blackjack/Blackjack";
import { Craps } from "./games/Craps/Craps";
import { Ruleta } from "./games/Ruleta/Ruleta";
import { Tragamonedas3 } from "./games/Tragamonedas/Tragamonedas3/Tragamonedas3";
import { Tragamonedas5 } from "./games/Tragamonedas/Tragamonedas5/Tragamonedas5";
import { Juego } from "./Juego";

export class FabricaDeJuegos{
    public crear(opcion:string):Juego{

        switch(opcion){
            case "Craps": return new Craps();
            case "Blackjack": return new Blackjack();
            case "Tragamonedas3" :return new Tragamonedas3();
            // case "Tragamonedas5":return new Tragamonedas5();
            case "Ruleta": return new Ruleta();
            default: throw new Error("La opción no es valida");
        }

    }
}