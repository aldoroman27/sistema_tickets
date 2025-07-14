from flask import Flask,Blueprint, request, jsonify #Importamos nuestra biblioteca de Flask para levantar un pequeño servidor de nuestra app
from db import get_connection #Importamos nuestro archivo de db e importamos el método de get_connection para la base de datos
from flask_bcrypt import Bcrypt #Importamos Bcrypt para la desencriptación de las contraseñas.
import jwt
from flask_cors import CORS
from datetime import datetime, timedelta, timezone

bcrypt = Bcrypt() #Creamos una nueva instancia para poder desencriptar la información que nos llega a nosotros.
auth_bp = Blueprint('auth',__name__)#Indicamos las rutas que vamos a estar utilizando con blueprint para poder usarlas fuera de nuestro archivo
CORS(auth_bp)#No recuerdo que hacía esta vaina xd

SECRET_KEY = 'mido_clave123#' #Esta clave la deberemos de cambiar a una variable de entorno.

@auth_bp.route('/login', methods=['POST'])#Entramos a la ruta usando el método POST para así poder hacer uso de nuestra función soguiente.
def login():#Definimos nuestra función de login para poder validar la información
    try:
        conn = get_connection()#Hacemos la conexión a la base de datos que tenemos 
        cursor = conn.cursor(dictionary=True)#Definimos un cursor que nos ayudará con la información que se regrese

        data = request.json #La información será una petición de request.json
        id_usuario = data.get('id')#Obtenemos la información como nuestro id
        password = data.get('contrasena')#Obtenemos entonces nuestra contraseña

        # Buscar usuario en la base de datos
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id_usuario,))#Hacemos la consulta dentro de nuestra base de datos
        usuario = cursor.fetchone()#No recuerdo que hace esta vaina xd
        cursor.close()#Cerramos el cursor que es donde almacenamos la información que tenemos
        conn.close()#Cerramos la conexión a nuestra base de datos.

        # Validamos las credenciales usando bcrypt para quitar el hash de las contraseñas.
        if usuario and bcrypt.check_password_hash(usuario['password_hash'], password): #Implementar cuando tengamos hasheadas las pass
            token = jwt.encode({
                'id': usuario['id'],
                'admin':usuario['admin'],
                #Indicamos entonces la 'duración' de la sesión de nuestro usuario, está puesta a durar 2 horas.
                'exp':datetime.now(timezone.utc) + timedelta(hours=2) #Indicamos la zona horaria y aseguramos la compatibilidad
            }, SECRET_KEY, algorithm='HS256')
            return jsonify({ #Retornamos en un formato json
                'token': token,#El id de nuestro usuario
                'nombre': usuario['usuario'],# El nombre de nuestro usuario
                'admin': usuario['admin']# El tipo de usuario admin o no admin
            }), 200 #Retornamos el código de éxito de nuestro servidor
        else:#En caso de que no sean las credenciales correctas entonces
            #Indicamos el mensaje de error y además retornamos un mensaje de error en el servidor que sería el 401
            return jsonify({'message': 'Error, verifique nuevamente su información'}), 401
    except Exception as e:#En caso de fallar la conexión con el servidor entonces 
        #Retornamos errror de conexión con el servidor 
        return jsonify({'error': str(e)}), 500
