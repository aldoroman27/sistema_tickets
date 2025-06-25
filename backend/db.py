import mysql.connector

#Definimos las credenciales para acceder a nuestra base de datos, de momento nos mantenemos en localhost.
#Por ende estas son las credenciales y sin verificación.
def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database ='pruebas_mido'
    )