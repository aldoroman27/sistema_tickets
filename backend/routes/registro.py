from flask import request, jsonify, Blueprint
from db import get_connection
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()#Creamos una instancia de Bcrypt para poder hashear las contraseñas que vamos a utilizar
registro_bp = Blueprint('registro',__name__)#Usamos Blueprint para definir la ruta dentro de nuestro servidor

#Indicamos entonces la ruta, además del método que vamos a utilizar, en este caso, será el método POST
@registro_bp.route('/registro', methods=['POST'])
def registrar_usuario():#Definimos nuestra función para registrar al usuario
    try:#Usamos la sentencia try
        data = request.json #Usamos la información que tomamos como un json
        id_usuario = data.get('id')#De esa info obtenemos el id
        nombre_usuario = data.get('usuario')#El nombre completo del usuario
        contrasena = data.get('contrasena')#La contraseña
        admin = data.get('admin', False)#Además de que si es admin o no

        #Si ninguno de los siguientes campos contiene info, entonces mostramos error
        if not id_usuario or not nombre_usuario or not contrasena:
            return jsonify({'message':'Todos los campos son obligatorios'})
        else:#En caso de que todo sea correcto seguimos al siguiente bloque de instrucciones
            conn = get_connection()#Obtenemos una nueva conexión a nuestra base de datos
            cursor = conn.cursor()#Obtenemos un nuevo cursor para ejecutar las instrucciones
            
            #Definimos entonces la sentencia de SQL que se deberá de ejecutar junto con los valores.
            sql = """
            INSERT INTO usuarios (id, usuario, password_hash, admin)
            VALUES (%s,%s,%s,%s)
            """
            #Ejecutamos entonces el qery y le pasamos los valores que necesitamos
            contrasena_hasheada = bcrypt.generate_password_hash(contrasena).decode('utf-8')
            cursor.execute(sql,(id_usuario,nombre_usuario,contrasena_hasheada,admin))
            conn.commit()#Hacemos un commit a nuestra base de datos
            conn.close()#Cerramos la conexión a la base de datos
            #En caso de éxito regresamos el respectivo mensaje indicandolo
            return jsonify({'message': '👍 Éxito al guardar la información'}),201
    except Exception as e:
        #En caso de que se presente un error en el servidor lo indicamos seguido del error que ocurrió en este caso error de servidor
        print(str(e))
        return jsonify({'message':'Error en el servidor'}),500