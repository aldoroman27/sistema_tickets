from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import os

bcrypt = Bcrypt()

modificarUsuarios_bp = Blueprint('modificarUsuarios_bp', __name__)

client = MongoClient(os.getenv('MONGO_URI'))
db = client['pruebas_mido']
coleccion_usuarios = db['usuarios']


@modificarUsuarios_bp.route('/modificarUsuarios/<idUsuario>', methods=['PUT'])
def modificarUsuarios(idUsuario):
    try:
        datos = request.get_json()

        if not datos:
            return jsonify({'message': 'No se enviaron datos.'}), 400

        camposToupdate = {}

        # Actualizar nombre
        if 'nombre' in datos and datos['nombre']:
            camposToupdate['nombre'] = datos['nombre']

        # Actualizar ID del empleado
        if 'idEmpleado' in datos and datos['idEmpleado']:
            camposToupdate['idEmpleado'] = datos['idEmpleado']

        # Actualizar permisos
        if 'permisos' in datos:
            camposToupdate['admin'] = datos['permisos']

        # Actualizar contraseña SOLO si se envió
        if 'password' in datos and datos['password']:
            hashed_password = bcrypt.generate_password_hash(datos['password']).decode('utf-8')
            camposToupdate['password_hash'] = hashed_password

        if not camposToupdate:
            return jsonify({'message': 'No se proporcionaron campos válidos para actualizar.'}), 400

        resultado = coleccion_usuarios.update_one(
            {'idEmpleado': idUsuario},
            {'$set': camposToupdate}
        )

        if resultado.matched_count == 0:
            return jsonify({'message': f'No se encontró ningún usuario con el ID: {idUsuario}'}), 404

        return jsonify({'message': f'Usuario con ID {idUsuario} modificado correctamente.'}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'message': 'Error interno del servidor.'}), 500
