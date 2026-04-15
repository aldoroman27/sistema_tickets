from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from marshmallow import ValidationError
import os
from datetime import datetime, date
from dotenv import load_dotenv
from schemas.validarIncidencias import validarIncidenciaSchema
#Creamos una instancia de blueprint para poder utilizar nuestra ruta como backend.

incidencia_schema = validarIncidenciaSchema()
crearIncidencia_bp = Blueprint('crearincidencia_bp', __name__)

"""
Esta es la parte de la conexión a la db para las incidencias
"""

load_dotenv()

#Creamos las credenciales de nuestra conexión a la db
client = MongoClient(os.getenv("MONGO_URI"))
print(f"La clave es {os.getenv("MONGO_URI")}")
#Nos conectamos a nuestra base de datos
db = client['pruebas_mido']
#Usamos la colección de datos llamada incidencias.
coleccion_incidencias = db['incidencias']


"""
Esta es la creación de las rutas para las incidencias
"""

#Creamos una ruta blueprint para registrar las incidencias usando los métodos de POST y OPTIONS
@crearIncidencia_bp.route('/registrarIncidencia', methods=['POST','OPTIONS'])
#Creamos una función la cuál será la encargada de registrar la incidencia dentro de nuestra base de datos.
def registrarIncidencia():
    try:
        #Recibimos la información exclusivamente en json
        data = request.get_json(force=True)
        #Validamos todos los campos usando nuestro schema
        incidenciaValida = incidencia_schema.load(data)
        #Validmos la fecha
        if isinstance(incidenciaValida['fecha'], date):
            incidenciaValida['fecha'] = datetime.combine(
                incidenciaValida['fecha'], datetime.min.time()
            )
        #Hacemos
        coleccion_incidencias.insert_one(incidenciaValida)
        return jsonify({
            'message':'✅ Incidencia registrada correctamente'
        }),201
    except ValidationError as err:
        return jsonify({'message':err.messages}),400
    except Exception as e:
        return jsonify({'message':str(e)}),500

@crearIncidencia_bp.route('/consultarIncidencia', methods=["POST", "OPTIONS"])
def consultarIncidencia():
    try:
        incidencias_cursor = coleccion_incidencias.find()
        incidencias = []

        for indicencia in incidencias_cursor:
            incidencias.append(indicencia)
        
        return jsonify({'message': 'Consulta éxitosa'}),201
    except Exception as e:
        return jsonify({'message':str(e)}),500