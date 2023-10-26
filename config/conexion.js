const mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Martinez2023.',
    database :'saya',
    port: 3306
});

conexion.connect((err) => {
    if(err){
        console.log('ERROR:' + err)
    }
    else {
        console.log('CONEXION EXITOSA')
    }
});

module.exports= conexion;