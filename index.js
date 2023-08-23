require('./config/conexion');
//require('./config/rutas');

const express = require('express');
const cors = require('cors'); // Import the cors module
const app = express();
const morgan = require("morgan");
const port = 3000;

// Use the cors middleware to enable CORS
app.use(cors());

//CORS
// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  
// middleware 
app.use(morgan('dev')); //informacion de request y response
app.use(express.json()); //uso el metodo json de express para usar json
app.use(express.urlencoded({extended : false})); // para entender datos de css y html
app.use(require('./config/rutas')); //definición de rutas

//settings
app.set('port', process.env.PORT || port);

//iniciar express
app.listen(app.get('port'), (err) =>{
    if(err) {
        console.log('Error al inciar el servidor');
    } else {
        console.log('Server on port ' + port);
    }
        
});

console.log('HOLA MUNDO');