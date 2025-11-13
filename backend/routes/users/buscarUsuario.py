from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os

buscarUsuarios_bp = Blueprint('buscarUsuarios_bp', __name__)


client = MongoClient(os.getenv('MONGO_URI'))
db = client['pruebas_mido']
coleccion_usuarios = db['usuarios']


@buscarUsuarios_bp.route('/buscarUsuarios/<idUsuario>', methods=['GET'])
def buscarUsuarios(idUsuario):
    try:
        print("Entré aquí")
        usuario = coleccion_usuarios.find_one({"idEmpleado":idUsuario})
        if not usuario:
            print("No encontré a ningún usuario")
            return jsonify({'message':f'No se encontró el usuario con id:{idUsuario}'}),400
        usuario['_id'] = str(usuario['_id'])
        print(usuario)
        return jsonify(usuario),200
    except Exception as e:
        return jsonify({'message':'Error en la comunicación con el servidor'}),500