from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os

eliminarUsuarios_bp = Blueprint('eliminiarUsuarios_bp', __name__)

client = MongoClient(os.getenv('MONGO_URI'))
db = client['pruebas_mido']
coleccion_usuarios = db['usuarios']

@eliminarUsuarios_bp.route('/eliminarUsuarios/<idUsuario>', methods=['DELETE'])
def eliminarUsuario(idUsuario):
    try:
        resultado = coleccion_usuarios.delete_one({'idEmpleado':idUsuario})
        if resultado.deleted_count == 1:
            return jsonify({'message':f'Éxito al eliminar el usuario con id: {idUsuario}'}),200
        else:
            return jsonify({'message':f'No se encontró el usuario con id: {idUsuario}'}),404 
    except Exception as e:
        return jsonify({'message':'Error en la conexión con el servidor, intente nuevamente'}),500