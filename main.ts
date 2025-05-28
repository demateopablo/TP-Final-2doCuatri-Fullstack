import { Aplicacion } from "./Aplicacion";
import { Casino } from "./Casino";
import { Jugador } from "./Jugador";

let moneyForNothing: Casino = new Casino("Money.for(nothing)");

let gus: Jugador = new Jugador("Gustavo",42);
gus.modificarSaldo(150000);

let app: Aplicacion = Aplicacion.getInstancia(moneyForNothing,gus);

app.inicializar();
