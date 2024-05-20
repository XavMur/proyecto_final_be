const{Pool} = require('pg')

let connection;

function dbConnection (){
    const connData = {
        host: 'dpg-cp5cv9q1hbls73fdbtpg-a.oregon-postgres.render.com',
        user: 'huella_master',
        password: 'OApu7AGkAoa9TjPc6Esn4r73Bad5BpwV',
        database: 'proyecto_final_db',
        allowExitOnIdle: true
    }
    return{
        createConn: function (){
            if (!connection){
                console.log('Conexion con la base de datos creada')
                connection = new Pool(connData);
            } 
            return connection;
        }
    }
}

module.exports = {dbConnection}