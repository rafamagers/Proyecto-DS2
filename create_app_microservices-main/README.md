# Create Module - APP with microservices
Este repositorio contiene una API de inserción/creación de personas desarrollada en Node.js con Express y MongoDB. La API permite agregar información de personas, incluyendo una foto, a una base de datos.

## Descripción

- Agregar información de una persona, incluyendo nombre, apellidos, fecha de nacimiento, género, correo electrónico, número de teléfono, número de documento y una foto.
- Comprobar si la API está funcionando correctamente mediante una solicitud a la ruta raíz.

## Instrucciones de ejecución

1. Clonar el repositorio: Clona este repositorio en tu máquina local.
     ```bash
     git clone https://github.com/AndresFVargasV/create_app_microservices.git
3. Instalar Dependencias: Navega al directorio del proyecto en tu computador e instala las dependencias necesarias.
     ```bash
     npm install
4. Configurar la Base de Datos: Asegúrate de configurar tu base de datos SQL Server y ajustar la configuración de conexión en la carpeta dbconfig.js.
5. Ejecutar la Aplicación: Inicia el servidor de la API.
     ```bash
     npm run dev
  La API estará disponible en http://localhost:3000. Puedes acceder a la API a través de las rutas definidas, como /api/createpeople.

## Rutas de la API

- GET /api: Verifica si la API está funcionando. Debería responder con un mensaje JSON que confirma el funcionamiento de la API.
- POST /api/createpeople: Permite agregar información de una persona a la base de datos. Asegúrate de incluir todos los parámetros necesarios, incluyendo una foto que se enviará con la solicitud.

## Notas Importantes

- Esta API utiliza el middleware CORS para permitir solicitudes desde dominios cruzados en la ruta de creación de personas.
- Asegúrate de que la base de datos esté configurada correctamente y que el nombre de la BD y la Colección en MongoDB sean las mismas.
- La subida de archivos a través de esta API requiere la configuración adecuada del servidor para el almacenamiento de archivos. Asegúrate de que el directorio de destino exista y tenga permisos de escritura.


## Contribuciones

Si encuentras algún problema o tienes alguna mejora, siéntete libre de abrir un problema o enviar una solicitud de extracción.
