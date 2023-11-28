from flask import Flask, jsonify, make_response, Response
import json
import dbconfig as dbase
from flask_cors import CORS
import functions as f
from bson import json_util

# Inicializa la aplicación Flask
app = Flask(__name__)

# Permite el acceso desde cualquier origen a la API
CORS(app)

# Ruta base para la API
@app.route('/api', methods=['GET'])
def api():
    return jsonify({'msg': 'Hello World'})

# Ruta para obtener todos los registros de la colección "logs"
@app.route('/api/log', methods=['GET'])
def get_logs():
    conexion = dbase.establecer_conexion()

    # Verifica si la conexión fue exitosa
    if conexion:
        
        # Selecciona la base de datos y la colección "logs"
        db, collection = dbase.seleccionar_bd_y_coleccion(conexion, "crud", "microserviceslogs")

        # Busca todos los registros en la colección "logs"
        registros = collection.find()

        # Lista para almacenar la información de los registros con id de mongodb convertidos a string
        registros_id_string = []

        # Iteramos cada registro para convertir el id de mongodb a string
        for registro in registros:
            registro['_id'] = str(registro['_id'])
            registros_id_string.append(registro)

        # Cierra la conexión al finalizar
        dbase.cerrar_conexion(conexion)

        # Devuelve la respuesta JSON después de la iteración
        return Response(json.dumps({'registros': registros_id_string}, default=json_util.default), mimetype='application/json')
    else:

        # Devuelve la respuesta JSON teniendo en cuenta que la conexión no fue exitosa
        return make_response(jsonify({'error': 'No se pudo establecer la conexión con MongoDB'}), 500)


# Inicializa la aplicación Flask desde este modeulo base
if __name__ == '__main__':
    app.run(debug=True, port=5001)