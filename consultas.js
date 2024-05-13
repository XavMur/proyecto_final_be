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
    const query = "SELECT * FROM productos WHERE categoria1 = ANY(ARRAY[%s]) \
    OR categoria2 = ANY(ARRAY[%s]) OR categoria3 = ANY(ARRAY[%s])";
    const categoriasID = await getCategoriasParam(categorias);
    const consulta = format(query, categoriasID, categoriasID, categoriasID);
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

module.exports = {productosPorCategoria, getCategorias, getTendencias}