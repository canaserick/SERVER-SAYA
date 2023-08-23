import mysql from "promise-mysql";
//import mysql from "mysql2";
import config from "./../config.js";

const fkconexion = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database : config.database,
});

const getConnection = () => {
    return fkconexion;
}

module.exports = {
    getConnection
}

export default getConnection;