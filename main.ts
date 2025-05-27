import { Aplicacion } from "./Aplicacion";
import { Casino } from "./Casino";
import { Craps } from "./games/Craps/Craps";
import { Blackjack } from "./games/Blackjack/Blackjack";
import { Jugador } from "./Jugador";

let moneyForNothing: Casino = new Casino("Money.for(nothing)");
let dados: Craps = new Craps();
let dados2: Craps = new Craps();
moneyForNothing.agregarJuego(dados);
moneyForNothing.agregarJuego(dados2);
let gus: Jugador = new Jugador("Gustavo",42);
gus.modificarSaldo(150000);
// let pablo: Jugador = new Jugador("Pablo",38);
// let nahuel: Jugador = new Jugador("Nahuel",37);
// let diana: Jugador = new Jugador("Diana",12);
let app: Aplicacion = Aplicacion.getInstancia(moneyForNothing,gus);

app.inicializar();

// gus.apostar(moneyForNothing.getJuego(1));
