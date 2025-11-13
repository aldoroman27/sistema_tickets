from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os

#Creamos una nueva instancia de Bcrypt en caso de que quieran modificar la contraseña del usuario
bcrypt = Bcrypt()

#Definimos el Blueprint de nuestro endpoint
modificarUsuarios_bp = Blueprint('modificarUsuarios_bp', __name__)

#Definimos los parametros de la conexión con la db
client = MongoClient(os.getenv('MONGO_URI'))
db = client['pruebas_mido']
coleccion_usuarios = db['usuarios']

@modificarUsuarios_bp.route('/modificarUsuarios/<idUsuario>', methods=['PUT', 'OPTIONS'])
def modificarUsuarios(idUsuario):
    try:
        #Recibimos los datos del usuario que se desean modificar
        datos = request.json()
        #Creamos un diccionario que va a recibir los campos que se actualizarán
        camposToupdate = {}

        for campo in ["nombreCompleto", "idEmpleado", "password"]:
            if campo in datos:
                camposToupdate[campo] = datos[campo]
        if not camposToupdate:
            return jsonify({'message':'No se proporcinaron campos para actualizar'})
        resultado = coleccion_usuarios.update_one(
            {'idEmpleado':idUsuario},
            {'$set': camposToupdate}
        )

        if resultado.matched_count == 0:
            return jsonify({'message':f'No se encontró ningún usuario con el ID: {idUsuario}'}),400
        else:
            return jsonify({'message':f'Se modificó correctamente el usuario con ID: {idUsuario}'}),200
    except Exception as e:
        return jsonify({'message':'Error durante el proceso de conexión con el servidor...'}),500