import { Aplicacion } from "./app";
import { Casino } from "./Casino";
import { Craps } from "./games/Craps/Craps";
import { Jugador } from "./Jugador";

let moneyForNothing: Casino = new Casino("Money.for(nothing)");
let dados: Craps = new Craps("Craps",1000);
let dados2: Craps = new Craps("Craps2",500);
moneyForNothing.agregarJuego(dados);
moneyForNothing.agregarJuego(dados2);
let gus: Jugador = new Jugador("Gustavo",42,50000);
let pablo: Jugador = new Jugador("Pablo",38,150000);
let nahuel: Jugador = new Jugador("Nahuel",37,55000);
let diana: Jugador = new Jugador("Diana",12,50);
let app: Aplicacion = new Aplicacion(moneyForNothing);
app.registrarJugador(gus);
app.registrarJugador(pablo);
app.registrarJugador(diana);
app.registrarJugador(nahuel);

app.mostrarMenu();
app.listarJugadores();
gus.apostar(moneyForNothing.getJuego(1));