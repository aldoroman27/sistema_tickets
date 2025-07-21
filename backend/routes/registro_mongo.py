from flask import request, jsonify, Blueprint
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from routes.login_mongo import MONGO_URI
import os

bcrypt = Bcrypt()
registromongo_bp = Blueprint('registro_mongo',__name__)


client = MongoClient(os.getenv("MONGO_URI"))#Usamos nuestra variable de entorno.
db = client['pruebas_mido'] #Nombre de la base de datos
coleccion_usuarios = db['usuarios'] #Colección de datos que vamos a obtener

#Creamos nuestra ruta para registraer usuarios usando el método POST
@registromongo_bp.route('/registrar_usuario', methods=['POST','OPTIONS'])
def registrarUsuario():#Definimos nuestra función
    try:
        data = request.get_json()#Obtenemos la información que necesitamos en formato json
        print("DATA RECIBIDA: ", data)#Esto es para testeo y ver que la información que nos llega es la correcta
        idEmpleado = data.get('idEmpleado')#Hacemos set de la información que recuperamos
        nombre = data.get('nombre')#Hacemos el set del nombre completo de nuestro colaborador
        admin = data.get('admin')#Hacemos el set de si es admin o no
        print("Admin: ", admin)#Esto es para testeo y verificar si es admin o no admin
        password = data.get('password')#Obtenemos la contraseña

        if not all([idEmpleado,nombre,password]):#Si algún dato resulta faltante entonces 
            #Mostramos error e indicamos que se introduzcan todos los campos necesarios
            return jsonify({'message':'Error, introduzca todos los campos que se solicitan'}),400
        
        if admin not in[True, False]:
            return jsonify({'message':'Error, el campo debe ser True o False'}),400

        #Si el id del usuario o el nombre del usuario ya se encuentran en nuestra base de datos, entonces mostraremos error
        usuario_existente = coleccion_usuarios.find_one({
            '$or':[
                {'idEmpleado': idEmpleado},
                {'nombre':nombre}
            ]
        })
        #Si alguna de las caracteristicas se cumplen entonces
        if usuario_existente:#Hacemos la validación.
            #Retornamos entonces el mensaje de que el usuario ya existe.
            return jsonify({'message':'El usuario ya existe!'}),400
        #Encriptemos la contraseña
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        #Si ninguna de estas caracteristicas se cumplen, entonces le asignamos los valores a nuestra variable que va a almacenar la información
        nuevo_usuario = {
            'nombre':nombre,
            'idEmpleado':idEmpleado,
            'password_hash':password_hash,
            'admin':admin
        }
        
        #De nuestra "tabla"-colección en mongo vamos a insertar entonces un nuevo usuario. usando el método insert_one(data)
        coleccion_usuarios.insert_one(nuevo_usuario)
        #Finalmente mostramos un mensaje de éxito informando que el usuario fue agregado correctamente.
        return jsonify({'message':'Usuario agregado correctamente!'}),200
    #En caso de que se tenga un error en el servidor entraremos en este bloque.
    except Exception as e:
        print(f"ERROR EN EL SERVIDOR: {str(e)}")#Imprimimos en consola que tenemos error en el servidor y la respuesta que este arroja
        return jsonify({'message':str(e)}),500#Retornamos entonces el mensaje de error y además el código de error.