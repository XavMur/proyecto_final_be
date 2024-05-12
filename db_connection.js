const{Pool} = require('pg')

let connection;

function dbConnection (){
    const connData = {
        host: 'localhost',
        user: 'postgres',
        password: 'pgadmin',
        database: 'proyecto_final',
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

