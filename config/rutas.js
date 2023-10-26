const rutas = require('express').Router();
const conexion = require('./conexion');

//definicion de rutas
// ** LOGIN **
const validatePassword = (login, password) => {
    return new Promise((resolve, reject) => {
        conexion.query('CALL ValidaUsuario(?, ?, @isValid)', [login, password], (error, results) => {
        if (error) {
          reject(error);
        } else {
            conexion.query('SELECT @isValid AS isValid', (err, result) => {
            if (err) {
              reject(err);
            } else {
              const isValid = result[0].isValid;
              resolve(isValid);
            }
          });
        }
      });
    });
  };

rutas.post('/login', (req, res) => {
    const data = req.body;
    var resultado = 0;
       
      const login = data.login;
      const password = data.passwd;
      console.log(login);
      console.log(password);
      
      validatePassword(login, password)
        .then(isValid => {
          console.log('Password validation result:', isValid);
          res.json(isValid);
        })
        .catch(error => {
          console.error('Error while validating password:', error);
        })
     
});


/* STORED PROCEDURE PRODUCCION*/
const sp_produccion = (variedad, descripcion, mallas, tallos) => {
    return new Promise((resolve, reject) => {
        conexion.query('CALL Produccion(?, ?, ?, ?, @result)', [variedad, descripcion, mallas, tallos], (error, results) => {
        if (error) {
          reject(error);
        } else {
            conexion.query('SELECT @result AS result', (err, result) => {
            if (err) {
              reject(err);
            } else {
              const resultado = result[0].result;
              resolve(resultado);
            }
          });
        }
      });
    });
  };

rutas.post('/pr_produccion', (req, res) => {
    const data = req.body;
    var resultado = 0;
    const variedad = data.variedad;
    const descripcion = data.descripcion;
    const mallas = data.mallas;
    const tallos = data.tallos;

    sp_produccion(variedad, descripcion, mallas, tallos)
    .then(resultado => {
      console.log('Resultado:', resultado);
      res.json(resultado);
    })
    .catch(error => {
      console.error('Error en el sp:', error);
    })

}); // FIN DEL STORED PROCEDURE


// ** SELECT **
rutas.post('/select', (req, res) => {
    const data = req.body;

    if (data.operacion != "select"){
        res.json({status: 'Error - operacion invalida'});
    };

    let sql = `${data.operacion} `;
    if(data.campos[0].campo == "*"){
        sql += "* from ";
    } else {
        for (let i = 0; i < data.campos.length -1; i++){
            sql += data.campos[i].campo + ", ";
        };
        sql += data.campos[data.campos.length-1].campo;
        sql += " from ";
    };
    sql += data.tabla;
    
    if(data.condiciones[0].campo != "*"){
        sql += " where ";
        for (let i = 0; i <= data.condiciones.length -1; i++){
            sql += data.condiciones[i].campo; 
            sql += " ";
            sql += data.condiciones[i].cond;
            sql += " ";
            if (data.condiciones[i].tipo == "string"){
                sql += "'";
                sql += data.condiciones[i].valor;
                sql += "' "
            } else {
                sql += data.condiciones[i].valor;
            }
            
            if (i < data.condiciones.length -1){
                sql += " and "
            }
        };
    };

    console.log(sql);
    //ejecuto el query
    conexion.query(sql,(err, rows, fields) =>{
        if(err) {
            throw err;
        }
        else {
            res.json(rows);
        }
    })
});

// ** INSERT **
rutas.post('/insert', (req, res) =>{
    const data = req.body;
    if (data.operacion != "insert"){
        res.json({status: 'Error - operacion invalida'});
    };

    let str = " (";
    for (let i = 0; i < data.campos.length -1; i++){
        str += data.campos[i].campo + ",";
    };
    str += data.campos[data.campos.length-1].campo;
    str += ") ";

    let values = " values (";
    for (let i= 0; i < data.campos.length -1; i++){
        if (data.campos[i].tipo == "string"){
            values += "'";
            values += data.campos[i].valor;
            values += "',";
        } else {
            values += data.campos[i].valor + ",";
        }
    };

    if (data.campos[data.campos.length-1].tipo == "string"){
        values += "'";
        values += data.campos[data.campos.length-1].valor;
        values += "')";
    } else {
        values += data.campos[data.campos.length-1].valor;
        values += ") ";
    } 

    let sql = `${data.operacion} into ${data.tabla}`;
    sql += str += values; 
    console.log(sql);

    //ejecuto el query
    conexion.query(sql,(err, rows, fields) =>{
        if(err) {
            throw err;
        }
        else {
            res.json(rows);
        }
    });
});

// ** UPDATE **
rutas.post('/update', (req, res) =>{
    const data = req.body;
    if (data.operacion != "update"){
        res.json({status: 'Error - operacion invalida'});
    };
    let sql = `${data.operacion} ${data.tabla} set `;
    
    for (let i = 0; i <= data.campos.length -1; i++){
        sql += data.campos[i].campo + " = ";
        if (data.campos[i].tipo == "string"){
            sql += `'${data.campos[i].valor}'`
        } else {
            sql += data.campos[i].valor;
        }        
        if (i <data.campos.length -1){
            sql += ", ";
        }
    };

    if(data.condiciones[0].campo != "*"){
        sql += " where ";
        for (let i = 0; i <= data.condiciones.length -1; i++){
            sql += data.condiciones[i].campo; 
            sql += " ";
            sql += data.condiciones[i].cond;
            sql += " ";
            if (data.condiciones[i].tipo == "string"){
                sql += "'";
                sql += data.condiciones[i].valor;
                sql += "' "
            } else {
                sql += data.condiciones[i].valor;
            }
            
            if (i < data.condiciones.length -1){
                sql += " and "
            }
        
        }
    }

    console.log(sql);
    //ejecuto el query
    conexion.query(sql,(err, rows, fields) =>{
        if(err) {
            throw err;
        }
        else {
            res.json(rows);
        }
    });
});

// ** DELETE **
rutas.post('/delete', (req, res) =>{
    const data = req.body;
    if (data.operacion != "delete"){
        res.json({status: 'Error - operacion invalida'});
    };
    let sql = `${data.operacion} from ${data.tabla}`;
    
    if(data.condiciones[0].campo != "*"){
        sql += " where ";
        for (let i = 0; i <= data.condiciones.length -1; i++){
            sql += data.condiciones[i].campo; 
            sql += " ";
            sql += data.condiciones[i].cond;
            sql += " ";
            if (data.condiciones[i].tipo == "string"){
                sql += "'";
                sql += data.condiciones[i].valor;
                sql += "' "
            } else {
                sql += data.condiciones[i].valor;
            }
            
            if (i < data.condiciones.length -1){
                sql += " and "
            }
        
        }
    }

    console.log(sql);
    //ejecuto el query
    conexion.query(sql,(err, rows, fields) =>{
        if(err) {
            throw err;
        }
        else {
            res.json(rows);
        }
    });
});

module.exports=rutas;
