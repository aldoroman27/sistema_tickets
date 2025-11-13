#Importamos nuestras librerias con las que vamos a trabajar
from flask import jsonify,Blueprint, request #Jsonify para retornar mensajes desde el back y blueprint para definir las rutas
from pymongo import MongoClient #Mongo para la conexión con nuestra base de datos
import os #Os para poder usar las variables de entorno que tenemos alojadas en nuestro .env

#Definimos nuestro blueprint y creamos una instancia
consultrar_usuarios_bp = Blueprint('consultar_usuarios',__name__)

#Este es el proceso de la conexión con la base datos
client = MongoClient(os.getenv("MONGO_URI")) #Obtenemos el URL con la clave de nuestra db que está en nuestro .env
db = client['pruebas_mido'] #usamos el nombre nuestra base de datos
coleccion = db['usuarios'] #tomamos la tabla con la que vamos a trabajar

@consultrar_usuarios_bp.route('/consultar_usuarios', methods=['GET'])
def consultar_usuarios():
    try:
        usuarios_cursor = coleccion.find()
        usuarios = []

        for usuario in usuarios_cursor:
            usuarios.append({
                'idEmpleado':usuario.get('idEmpleado','N/A'),
                'nombre':usuario.get('nombre','N/A'),
                'password_hash':usuario.get('password_hash','N/A'),
                'admin':usuario.get('admin',False)
            })
        return jsonify(usuarios),200
    except Exception as e:
        print(f"Error al consultar los usuarios: {str(e)}")
        return jsonify({'message':'Error de conexión con el servidor, status: '}),500

