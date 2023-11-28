const MongoClient = require('mongodb').MongoClient;

// URL de conexión a tu base de datos MongoDB, incluyendo nombre de usuario y contraseña
const url = process.env.DBHOST;
// Exportar una función que devuelve la conexión una vez establecida
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(url);
    console.log('Conexión a MongoDB establecida correctamente');
    return client;
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
    throw err; // Propagar el error para que sea manejado en el módulo que utiliza esta función
  }
}

// Exportar la función para usarla en otros módulos
module.exports = { connectToDatabase };
