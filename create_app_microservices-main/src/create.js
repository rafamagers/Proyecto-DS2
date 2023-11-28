const { connectToDatabase } = require('./dbconfig');


// Función para insertar una persona en la colección 'crudmicroservices'
async function insertarPersona(primer_nombre, segundo_nombre, apellidos, fecha_nacimiento, genero_id,
    correo_electronico, celular, numero_documento, tipo_documento, foto) {

    let client;

    try {
        // Conectarse a MongoDB
        client = await connectToDatabase();


        // Crear el documento que se va a insertar en la colección
        const persona = {
            primer_nombre,
            segundo_nombre,
            apellidos,
            fecha_nacimiento,
            genero_id,
            correo_electronico,
            celular,
            numero_documento,
            tipo_documento,
            foto: foto.buffer.toString('base64')
        };

        // Iniciar una sesión de transacción para estar seguros de que se insertan las dos transacciones
        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                // Seleccionar la base de datos y la colección
                const db = client.db('crud');


                const collection_person = db.collection('crudmicroservices');
                // Insertar el documento en la colección de personas
                const result_person = await collection_person.insertOne(persona);

                const collection_log = db.collection('microserviceslogs');
                // Insertar el documento en la colección de logs
                const result_log = await collection_log.insertOne(info_log(tipo_documento, numero_documento));
            });
            return true;
        } catch (error) {
            return false;
        } finally {
            // Cerrar la sesión de la transacción
            await session.endSession();
        }
    } catch (error) {
        // Responder con error si este se presenta
        return false;
    } finally {
        // Cerrar la conexión con MongoDB
        if (client) {
            await client.close();
        }
    }
}

// Función para construir el documento que se va a insertar en la colección de logs
function info_log(tipo_documento, numero_documento) {
    const log = {
        tipo: "CREATE",
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        fecha: obtenerFechaFormateada(),
        descripcion: `Se agrego el usuario: ${numero_documento}`
    };

    return log;
}


// Función para verificar si un usuario ya existe en la colección 'crudmicroservices'
async function checkUser(dato) {
    let client;

    try {
        // Conectarse a MongoDB
        client = await connectToDatabase();

        // Seleccionar la base de datos y la colección
        const db = client.db('crud');
        const collection = db.collection('crudmicroservices');

        // Buscar el usuario
        const user = await collection.findOne({ 'numero_documento': dato });

        // Comprobar si se encontró un usuario
        if (user != null) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        return false;
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Función para insertar una persona en la colección 'crudmicroservices'
const obtenerFechaFormateada = () => {
    const mesesAbreviados = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const fechaActual = new Date();

    const dia = fechaActual.getDate();
    const mesAbreviado = mesesAbreviados[fechaActual.getMonth()];
    const anio = fechaActual.getFullYear();

    // Agrega un cero al día si es menor que 10
    const diaFormateado = dia < 10 ? `0${dia}` : dia;

    // Construye la cadena de formato
    const fechaFormateada = `${diaFormateado}-${mesAbreviado}-${anio}`;

    return fechaFormateada;
};



// Exportar módulo para utilizar insertarPersona desde otros modulos
module.exports = { insertarPersona, checkUser };