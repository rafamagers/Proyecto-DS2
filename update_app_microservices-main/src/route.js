const express = require('express');
const router = express.Router();
const actualizarPersona = require('./update.js');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta inicial
router.get('/', (req, res) => {
    res.json({
        "Res": "API is working"
    });
});

// Ruta para actualizar una persona en la base de datos teniendo en cuenta su número de documento.
// Implementamos cors para que no haya problemas de comunicación entre el cliente y el servidor al hacer la petición
// Implementamos multer para poder recibir la imagen en formato base64
router.post('/updatepeople', cors(), upload.single('foto'), async (req, res) => {
    
    // Obtenemos los datos del cuerpo de la petición
    const {
        primer_nombre,
        segundo_nombre,
        apellidos,
        fecha_nacimiento,
        genero_id,
        correo_electronico,
        celular,
        numero_documento,
        tipo_documento } = req.body;

    // Obtenemos la imagen en formato base64
    const foto = req.file ? req.file.buffer.toString('base64') : req.body.foto;
    
    // Llamamos a la función que actualiza una persona en la base de datos y manejamos los errores con try/catch
    try {

        // Llamamos a la función que actualiza una persona en la base de datos
        const result = await actualizarPersona(primer_nombre,
            segundo_nombre,
            apellidos,
            fecha_nacimiento,
            genero_id,
            correo_electronico,
            celular,
            numero_documento,
            tipo_documento,
            foto);
            
        if (result) {
            // Si la actualización fue exitosa, retornamos un mensaje de éxito
            res.status(200).json({
                "res": "People updated successful"
            });
        } else {
            // Si la actualización no fue exitosa, retornamos un mensaje de error
            res.status(503).json({
                "res": "People updated failed"
            });
        }
    } catch (err) {
        // Si hubo un error, respondemos la petición con un error 503 Service Unavailable
        res.status(503).json({
            "res": "People updated failed"
        });
    }
});

// Exportamos el módulo
module.exports = router;