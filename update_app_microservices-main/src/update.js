const { connectToDatabase } = require('./dbconfig');

// Función asíncrona para actualizar una persona en la base de datos
async function actualizarPersona(
    primer_nombre,
    segundo_nombre,
    apellidos,
    fecha_nacimiento,
    genero_id,
    correo_electronico,
    celular,
    numero_documento,
    tipo_documento,
    foto) {

    let client;

    // Implementar la logica aquí para actualizar una persona en la base de datos y manejamos los errores con try/catch
    try {
        // Obtener la conexión con la base de datos
        client = await connectToDatabase();

        // Iniciar una sesión de transacción para estar seguros de que se insertan las dos transacciones
        const session = client.startSession();
        try {
            await session.withTransaction(async () => {
                // Seleccionar la base de datos y la colección
                const db = client.db('crud');

                // Creamos un filtro para buscar el documento que queremos actualizar
                const filtro = { numero_documento: numero_documento };

                // Creamos un objeto con los nuevos valores para actualizar el documento
                const nuevosValores = {
                    $set: {
                        primer_nombre,
                        segundo_nombre,
                        apellidos,
                        fecha_nacimiento,
                        genero_id,
                        correo_electronico,
                        celular: celular,
                        numero_documento,
                        tipo_documento,
                        foto
                    }
                };

                const collection_person = db.collection('crudmicroservices');
                // Actualizamos el documento
                const result_update = await collection_person.updateOne(filtro, nuevosValores);


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
        // Respodemos la petición con un error 503 Service Unavailable
        return false;
    } finally {
        // Cerrar la conexión con MongoDB
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

// Función para construir el documento que se va a insertar en la colección de logs
function info_log(tipo_documento, numero_documento) {
    const log = {
        tipo: "UPDATE",
        tipo_documento: tipo_documento,
        numero_documento: numero_documento,
        fecha: obtenerFechaFormateada(),
        descripcion: `Se actualizó el usuario: ${numero_documento}`
    };

    return log;
}

// Exportar la función para usarla en otros módulos
module.exports = actualizarPersona;