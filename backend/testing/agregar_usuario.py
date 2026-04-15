import os
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from getpass import getpass

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['sistema_tickets'] #Nombre de la base de datos
coleccion_usuarios = db['usuarios'] #Colección de datos que vamos a obtener

bcrypt = Bcrypt()

def crear_usuairo():
    print("------ Creando usuario manualmente ----------")
    idEmpleado = input("ID de Empleado: ")
    nombre = input("Nombre del Empleado: ")
    admin_input = input("¿Es admin? (s/n)").lower
    admin =  True if admin_input == 's' else False

    password = getpass("Contraseña: ")
    confirm_password = getpass("Confirma contraseña: ")

    if password != confirm_password:
        print("Las contraseñas no coinciden")
        return
    
    existe = coleccion_usuarios.find_one({
        '$or': [{'idEmpleado': idEmpleado}, {'nombre':nombre}]
    })

    if existe:
        print("Ya existe un usuario con estas contraseñas!")
        return
    
    try:
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        nuevo_usuario = {
            'nombre': nombre,
            'idEmpleado': idEmpleado,
            'password_hash':password_hash,
            'admin': True
        }

        coleccion_usuarios.insert_one(nuevo_usuario)
        print("Usuario agregado correctamente!")

    except Exception as e:
        print(f"Ocurrió un error durante la inserción: {e}")

if __name__ == "__main__":
    crear_usuairo()