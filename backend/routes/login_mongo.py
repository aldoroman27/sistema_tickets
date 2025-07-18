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

#Definimos nuestra ruta para el proceso del login usando el método POST
@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():#Definimos nuestra función del login
    try:
        data = request.json #Hacemos un request para obtener los datos que se introdujeron
        id_usuario = data.get('id') #Asignamos a una variable el valor del id del usuairo
        password = data.get('contrasena') #Asigamos a una variable el valor de la pass 
        #Si hace falta alguno de esos dos campos es decir que no llegó nada entonces:
        if not id_usuario or not password:
            #Retornamos el mensaje de error indicando que hace falta que se ingresen los datos y que se intente de nuevo
            return jsonify({'message':'Error, datos faltantes, intente de nuevo'})
        #En caso que se encuentren entonces hacemos una búsqueda dentro de nuestra base de datos.
        usuario = coleccion_usuarios.find_one({"idEmpleado":id_usuario})
        #Imprimimos en consola el usuario por id
        print("Doc de mongo: ",usuario)
        #Hacemos la verificación del usuario y la contraseña sin su hash y hacemos la configuración
        if usuario and bcrypt.check_password_hash(usuario['password_hash'], password):
            token = jwt.encode({#Retornamos un token para proteger las rutas del backend.
                'id':usuario['id'],#Recuperamos entonces la información del usuario id
                'admin':usuario['admin'],#Tipo de usuario
                'exp': datetime.now(timezone.utc) + timedelta(hours=2)#Tiempo de vida de nuestro usuario.
            },SECRET_KEY, algorithm='HS256')#Usamos una SECRET_KEY

            #Retornamos entonces el valor en formato json
            return jsonify({
                'token':token,#Retornamos entonces el valor de nuestro token
                'nombre':usuario.get('nombreCompleto') or usuario.get('nombre'),#Retornamos el nombre de nuestro usuario
                'admin':usuario['admin'],#El valor de admin True o False
                'id':usuario['id']# Y finalmente su id
            }),200#Retornamos con el código del servidor que es 200 = ok
        else:#En caso de que no sean las credenciales, entonces
            #Retornamos el mensaje del error y el código 404 de que no se encontró.
            return jsonify({'message': 'Error al verificar la información, intente de nuevo'}),404
    except Exception as e:#En caso de no lograr la conexión a la base de datos entonces
        print(f"Error en /login: {str(e)}")#Mostramos el error en la consola.
        return jsonify({'message':str(e)}),500 #Mostramos error en el servidor