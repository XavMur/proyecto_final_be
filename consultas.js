const format = require("pg-format");
const { dbConnection } = require("./db_connection.js");
const bcrypt = require('bcrypt');
const conn = dbConnection();
const saltRounds = 10;

async function hashPassword(plainTextPassword) {
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

const getCategoriasParam = async (categorias) => {
  consulta = "SELECT * FROM categorias";
  try {
    const { rows } = await conn.createConn().query(consulta);
    catID = rows
      .filter((categoria) => categorias.includes(categoria.categoria))
      .map((categoria) => categoria.id);
    return catID;
  } catch (error) {
    throw { code: 404, message: "Error al obtener las categorias" };
  }
};

const productosPorCategoria = async (categorias) => {
  let consulta;
  if (categorias == "*") {
    consulta = "SELECT * FROM productos ORDER BY id";
  } else {
    const query =
      "SELECT * FROM productos WHERE categoria1 = ANY(ARRAY[%s]) \
        OR categoria2 = ANY(ARRAY[%s]) OR categoria3 = ANY(ARRAY[%s])";
    const categoriasID = await getCategoriasParam(categorias);
    consulta = format(query, categoriasID, categoriasID, categoriasID);
  }

  try {
    const { rows } = await conn.createConn().query(consulta);
    console.log("PETICION DE PRODUCTOS");
    return rows;
  } catch (error) {
    throw { code: 404, message: "Error al obtener los productos" };
  }
};

const getCategorias = async () => {
  const query = "SELECT * FROM categorias";
  try {
    const { rows } = await conn.createConn().query(query);
    console.log("PETICION DE CATEGORIAS");
    return rows;
  } catch {
    throw { code: 404, message: "Error al obtener las categorias" };
  }
};

const getTendencias = async () => {
  const queryTend = "SELECT catTendencia FROM tendencias";
  let tendencias;
  try {
    const { rows } = await conn.createConn().query(queryTend);
    tendencias = rows;
  } catch {
    throw { code: 404, message: "Error al obtener las tendencias" };
  }
  const queryCatTend = "SELECT * FROM categorias WHERE id = ANY(ARRAY[%s]);";
  const tendenciaId = tendencias.map((tendencia) => tendencia.cattendencia);
  const query = format(queryCatTend, tendenciaId);

  try {
    const { rows } = await conn.createConn().query(query);
    console.log("PETICION DE TENDENCIAS");
    return rows;
  } catch {
    throw { code: 404, message: "Error al obtener las tendencias" };
  }
};

const getProduct = async (id) => {
  const consulta = `SELECT * FROM productos WHERE id = ${id}`;
  try {
    const { rows } = await conn.createConn().query(consulta);
    console.log("PETICION DE Producto");
    return rows;
  } catch {
    throw { code: 404, message: "Error al obtener el producto" };
  }
};

const updateProfile = async (datos) => {
    const consulta = `
      UPDATE Usuarios
      SET 
        usuario = $1,
        pais = $2,
        ciudad = $3,
        telefono = $4,
        email = $5,
        nacimiento = $6,
        direccion = $7
      WHERE id = $8;`;
  
    const values = [
      datos.usuario,
      datos.pais,
      datos.ciudad,
      datos.telefono,
      datos.email,
      datos.nacimiento,
      datos.direccion,
      datos.id
    ];
  
    try {
      const { rows } = await conn.createConn().query(consulta, values);
      console.log("ACTUALIZACION DE PERFIL");
      return rows;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw { code: 404, message: "Error al actualizar el perfil" };
    }
  };
  

const getId = async (tableName) => {
  const consulta = `SELECT MAX(id) FROM ${tableName};`;
  try {
    const { rows } = await conn.createConn().query(consulta);
    return rows;
  } catch (error) {
    console.error("Error getting ID:", error);
    throw { code: 404, message: "Error al obtener el id" };
  }
};

const addUser = async (user) => {
  let consulta;
  let values;
  maxId = await getId("usuarios");
  if (user.password) {
    consulta =
      "INSERT INTO usuarios(id,usuario, email, pass) VALUES ($1, $2, $3, $4);";
    const hashPass = hashPassword(user.password)
    values = [maxId[0].max + 1, user.usuario, user.email, hashPass];
  } else {
    consulta = "INSERT INTO usuarios(id,usuario, email) VALUES ($1, $2, $3);";
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
  const consulta = "SELECT * FROM usuarios WHERE email = $1;";
  let resultado;
  try {
    const { rows } = await conn.createConn().query(consulta, [user.email]);
    console.log("REVISION DE USUARIO");
    if (rows.length == 0) {
      resultado = await addUser(user);
    } else {
      resultado = "Usuario verificado";
    }
    return resultado;
  } catch (error) {
    console.error("Error:", error);
    throw { code: 404, message: "Error al verificar el usuario" };
  }
};

  const addUser2ndlogin = async(user) =>{
    const consulta = "SELECT * FROM usuarios WHERE email = $1;";
    try{
        const { rows } = await conn.createConn().query(consulta, [user.email]);
        console.log("REVISION DE USUARIO");
        if( rows.length > 0){
            const match = await bcrypt.compare(user.password, rows[0].pass);
            if(match)
                {
                    return rows;
                }else{
                    return "Correo no valido";
                }
        }else{
            return "No existe";
        }
    }catch (error) {
        console.error('Error:', error);
        throw { code: 404, message: "Error al verificar el usuario" };
      }
  }

  const getUserData = async(email) =>{
    consulta = "SELECT * FROM usuarios WHERE email = $1;";
    try{
        const { rows } = await conn.createConn().query(consulta, [email.email]);
        return rows;
        console.log("REVISION DE USUARIO");
    }catch (error) {
        console.error('Error:', error);
        throw { code: 404, message: "Error al obtener datos" };
      }
  }

  const handleCartData = async(cartData) =>{
    const consulta = "SELECT * FROM carrito WHERE idUsuario = $1 AND idProducto = $2;";
    const consultaAdd = "INSERT INTO carrito(id, idProducto, idusuario, cantidad) VALUES ($1,$2,$3,$4);"
    const consultaEdit = "UPDATE carrito SET cantidad = $1 WHERE idUsuario = $2 AND idProducto = $3;"
    try{
        const {rows} = await conn.createConn().query(consulta,[cartData.idUsuario, cartData.idProducto]);
        if(rows.length == 0){
            const id = await getId("carrito");
            try{
                const {rows} = await conn.createConn().query(consultaAdd,[id[0].max + 1, cartData.idProducto, cartData.idUsuario, cartData.quantity]);
                return "Datos agregados al carrito";
            }catch (error) {
                console.error('Error:', error);
                throw { code: 404, message: "Error al agregar datos al carrito" };
              }
        }else{
            try{
                const {rows} = await conn.createConn().query(consultaEdit,[cartData.quantity, cartData.idUsuario, cartData.idProducto]);
                return "Datos actualizados en el carrito";
            }catch (error) {
                console.error('Error:', error);
                throw { code: 404, message: "Error al editar datos del carrito" };
              }
        }
    }catch (error) {
        console.error('Error:', error);
        throw { code: 404, message: "Error al obtener datos del carrito" };
      }
  }

  const getCartItems = async(idusuario) =>{
    const consulta = "SELECT * FROM carrito WHERE idUsuario = $1;";
    try{
        const {rows} = await conn.createConn().query(consulta,[idusuario.idusuario]);
        return rows
        
    }catch (error) {
        console.error('Error:', error);
        throw { code: 404, message: "Error al editar datos del carrito" };
      }
  }

module.exports = {
    productosPorCategoria, 
    getCategorias, 
    getTendencias, 
    getProduct, 
    verifyUser,
    addUser2ndlogin,
    updateProfile, 
    getUserData, 
    handleCartData,
    getCartItems
}
