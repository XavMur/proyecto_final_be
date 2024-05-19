const { Pool } = require("pg");

let connection;

function dbConnection() {
  const connData = {
    host: "localhost",
    user: "postgres",
    password: "postgre",
    database: "proyecto_final",
    allowExitOnIdle: true,
  };
  return {
    createConn: function () {
      if (!connection) {
        console.log("Conexion con la base de datos creada");
        connection = new Pool(connData);
      }
      return connection;
    },
  };
}

module.exports = { dbConnection };

// const { Pool } = require("pg");
// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "guitarra1998",
//   database: "proyecto_final",
//   allowExitOnIdle: true,
// });
// const getDate = async () => {
//   const result = await pool.query("SELECT NOW()");
//   console.log(result);
// };
// getDate();
