from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from routes.login_mongo import MONGO_URI
import os

bcrypt = Bcrypt()
registromongo_bp = Blueprint('registro_mongo',__name__)
client = MongoClient(os.getenv("MONGO_URI"))
db = client['pruebas_mido'] #Nombre de la base de datos
coleccion_usuarios = db['usuarios'] #Colección de datos que vamos a obtener

@registromongo_bp.route('/registrar_usuario', methods=['POST'])
def registrarUsuario():
    try:
        data = request.get_json()
        print("DATA RECIBIDA: ", data)
        idEmpleado = data.get('idEmpleado')
        nombre = data.get('nombreCompleto')
        admin = data.get('admin')
        print("Admin: ", admin)
        password = data.get('password')

        if not all([idEmpleado,nombre,password]):
            return jsonify({'message':'Error, introduzca todos los campos que se solicitan'}),400
        
        usuario_existente = coleccion_usuarios.find_one({
            '$or':[
                {'idEmpleado': idEmpleado},
                {'nombreCOmpleto':nombre}
            ]
        })

        if usuario_existente:
            return jsonify({'message':'El usuario ya existe!'}),400
        #Encriptemos la contraseña
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        nuevo_usuario = {
            'nombreCompleto':nombre,
            'idEmpleado':idEmpleado,
            'password_hash':password_hash,
            'admin':admin
        }

        coleccion_usuarios.insert_one(nuevo_usuario)

        return jsonify({'message':'Usuario agregado correctamente!'}),200
        
    except Exception as e:
        print(f"ERROR EN EL SERVIDOR: {str(e)}")
        return jsonify({'message':str(e)}),500