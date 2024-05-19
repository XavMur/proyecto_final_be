const format = require("pg-format");
const { dbConnection } = require("./db_connection.js");
const conn = dbConnection();

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

const updateProfile = async (datos, userId) => {
  const consulta = `
    UPDATE Usuarios
    SET 
      usuario = ${datos.name},
      pais = ${datos.country},
      ciudad = ${datos.city},
      telefono = ${datos.phone},
      email = ${datos.email},
      nacimiento = ${datos.birthDate},
      direccion = ${datos.address}
    WHERE id = ${userId}`;

  try {
    const result = await db.query(consulta);
    console.log("Profile updated successfully:", result);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

module.exports = {
  productosPorCategoria,
  getCategorias,
  getTendencias,
  getProduct,
  updateProfile,
};
