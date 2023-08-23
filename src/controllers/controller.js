import getConnection from "./../database/database.js";

const getData = async (req, res) => {
    const laConexion = await getConnection ();
    const result = await getConnection .query("SELECT * FROM variedad")
    console.log(result);
    res.json(result); 
};


export const methods = {
    getData    
};
