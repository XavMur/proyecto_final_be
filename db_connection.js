const{Pool} = require('pg')

let connection;

function dbConnection (){
    const connDataDeploy = {
        host: 'dpg-cp5dqmn79t8c73esj1dg-a.oregon-postgres.render.com',
        user: 'huella_master',
        password: 'TyyTnAqfEUiNa9MbQhdmicKsn9FlssAW',
        database: 'proyecto_final_be',
        ssl: { rejectUnauthorized: false },
        allowExitOnIdle: true
    }
    const connDataLocal = {
        host: "localhost",
        user: "postgres",
        password: "pgadmin",
        database: "proyecto_final",
        allowExitOnIdle: true,
    }
    return{
        createConn: function (){
            if (!connection){
                console.log('Conexion con la base de datos creada')
                connection = new Pool(connDataDeploy);
            } 
            return connection;
        }
    }
}

module.exports = {dbConnection}