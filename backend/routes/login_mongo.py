from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta, timezone
import jwt
import os


bcrypt = Bcrypt()
auth_bp = Blueprint('auth',__name__)
CORS(auth_bp)


SECRET_KEY = 'mido_clave123#'

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['pruebas_mido'] #Nombre de la base de datos
coleccion_usuarios = db['usuarios'] #Colección de datos que vamos a obtener

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        id_usuario = data.get('id')
        password = data.get('contrasena')

        if not id_usuario or not password:
            return jsonify({'message':'Error, datos faltantes, intente de nuevo'})
        usuario = coleccion_usuarios.find_one({"id":id_usuario})
        print("Doc de mongo: ",usuario)
        if usuario and bcrypt.check_password_hash(usuario['password_hash'], password):
            token = jwt.encode({
                'id':usuario['id'],
                'admin':usuario['admin'],
                'exp': datetime.now(timezone.utc) + timedelta(hours=2)   
            },SECRET_KEY, algorithm='HS256')

            return jsonify({
                'token':token,
                'nombre':usuario.get('usuario') or usuario.get('nombre'),
                'admin':usuario['admin'],
                'id':usuario['id']
            }),200
        else:
            return jsonify({'message': 'Error al verificar la información, intente de nuevo'})
    except Exception as e:
        print("Error en /login: ",e)
        return jsonify({'message':str(e)}),500 #Mostramos error en el servidor