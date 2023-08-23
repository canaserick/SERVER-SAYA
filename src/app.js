import express from "express";
import morgan from "morgan";
import Routes from "./routes/routes.js" ;

const app = express();  //creo la app de express global del proyecto para usar rutas http (get, post...)

const port = 3000;
app.set('port', process.env.PORT || port); //seteo el puerto donde escucha la aplicacion

//Middlewares - funciones intermedias entre la petición y la respuesta
app.use(morgan('dev'));

//Rutas
app.use(Routes);

export default app; // exporto la app para poder usarla desde otros modulos