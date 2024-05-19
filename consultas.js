const format = require("pg-format");
const {dbConnection} = require('./db_connection.js')
const conn = dbConnection()

const getCategoriasParam = async (categorias) =>{
    consulta = "SELECT * FROM categorias";
    try{
        const {rows} = await conn.createConn().query(consulta);
        catID = rows.filter(categoria =>categorias.includes(categoria.categoria)).map(categoria => categoria.id);
        return catID;
    }catch(error){
        throw {"code": 404, "message": "Error al obtener las categorias"};
    }
}

const productosPorCategoria = async (categorias) =>{
    let consulta;
    if(categorias == "*")
        {
            consulta = "SELECT * FROM productos ORDER BY id";
        }
    else{
        const query = "SELECT * FROM productos WHERE categoria1 = ANY(ARRAY[%s]) \
        OR categoria2 = ANY(ARRAY[%s]) OR categoria3 = ANY(ARRAY[%s])";
        const categoriasID = await getCategoriasParam(categorias);
        consulta = format(query, categoriasID, categoriasID, categoriasID);
    }

    try{
        const {rows} = await conn.createConn().query(consulta);
        console.log("PETICION DE PRODUCTOS")
        return rows
    } catch(error){
        throw{"code": 404, "message": "Error al obtener los productos"};
    }
}


const getCategorias = async () =>{
    const query = "SELECT * FROM categorias";
    try{
        const {rows} = await conn.createConn().query(query);
        console.log("PETICION DE CATEGORIAS")
        return rows;
    }catch{
        throw{"code": 404, "message": "Error al obtener las categorias"};
    }
}

const getTendencias = async () =>{
    const queryTend = "SELECT catTendencia FROM tendencias";
    let tendencias;
    try{
        const {rows} = await conn.createConn().query(queryTend);
        tendencias = rows;
    }catch{
        throw{"code": 404, "message": "Error al obtener las tendencias"};
    }
    const queryCatTend = "SELECT * FROM categorias WHERE id = ANY(ARRAY[%s]);"
    const tendenciaId = tendencias.map(tendencia => tendencia.cattendencia);
    const query = format(queryCatTend, tendenciaId);
    
    try{
        const {rows} = await conn.createConn().query(query);
        console.log("PETICION DE TENDENCIAS")
        return rows;
    }catch{
        throw{"code": 404, "message": "Error al obtener las tendencias"};
    }
}

const getProduct = async (id) =>{
    const consulta = `SELECT * FROM productos WHERE id = ${id}`;
    try{
        const {rows} = await conn.createConn().query(consulta);
        console.log("PETICION DE Producto")
        return rows;
    }catch{
        throw{"code": 404, "message": "Error al obtener el producto"};
    }
}

const getId = async (tableName) =>{
    const consulta = `SELECT MAX(id) FROM ${tableName};`;
    try{
        const { rows } = await conn.createConn().query(consulta);
        return rows;
    }catch (error) {
        console.error("Error getting ID:", error);
        throw { code: 404, message: "Error al obtener el id" };
    }
}

const addUser = async (user) => {
    let consulta;
    let values;
    maxId = await getId('usuarios');
    if (user.password) {
        consulta = 'INSERT INTO usuarios(id,usuario, email, pass) VALUES ($1, $2, $3, $4);';
        values = [maxId[0].max + 1, user.usuario, user.email, user.password];
    } else {
        consulta = 'INSERT INTO usuarios(id,usuario, email) VALUES ($1, $2, $3);';
        values = [maxId[0].max + 1, user.usuario, user.email];
    }

    try {
        await conn.createConn().query(consulta, values);
        console.log("AGREGADO DE USUARIO");
        return "Usuario verificado, Usuario agregado";
    } catch (error) {
        console.error("Error adding user:", error);
        throw { code: 404, message: "Error al agregar el usuario" };
    }
};

const verifyUser = async (user) => {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1;';
    let resultado;
    try {
      const { rows } = await conn.createConn().query(consulta, [user.email]);
      console.log("REVISION DE USUARIO");
      if (rows.length == 0){
        resultado = await addUser(user);
      }else{
        resultado = "Usuario verificado";
      }
      return resultado;
    } catch (error) {
      console.error('Error:', error);
      throw { code: 404, message: "Error al verificar el usuario" };
    }
  };

module.exports = {productosPorCategoria, getCategorias, getTendencias, getProduct, verifyUser}