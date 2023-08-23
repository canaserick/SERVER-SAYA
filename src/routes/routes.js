import {Router} from "express";
import {methods as MyController} from "./../controllers/controller.js";

const myrouter = Router();

//Definicion de las rutas
/*
myrouter.get("/", MyController.getData);
myrouter.get("/api/language", MyController.getData);
*/
export default myrouter;