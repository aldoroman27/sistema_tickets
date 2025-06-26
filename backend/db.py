#Importamos nuestras librerias que nos ayudarán con la conexión.
import mysql.connector

#Definimos las credenciales para acceder a nuestra base de datos, de momento nos mantenemos en localhost.
#Por ende estas son las credenciales y sin verificación.
def get_connection():
    return mysql.connector.connect(
        host='localhost', #Lo dejamos en localhost mientras hacemos las pruebas necesarias
        user='root', #El usuario es root por defecto
        password='', #No cuenta con contraseña nuestro GBD por ende dejamos este campo vacío.
        database ='pruebas_mido' #Seleccionamos nuestra base de datos.
    )