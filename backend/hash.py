#Importamos la librería de flask que usa Bcrypt, que es un formato de encriptación para contraseñas
from flask_bcrypt import Bcrypt
#Importamos la conexión a nuestra base de datos.
from db import get_connection

#Definimos una instancia de Bcrypt
bcrypt = Bcrypt()

#Definimos nuestra función que va a hacer el hasheo de las contraseñas
def hash_pass():
    try:#Intentamos ejecutar el siguiente bloque de instrucciones
        conn = get_connection()#Hacemos una conexión a nuestra base de datos
        cursor = conn.cursor(dictionary=True)#Definimos un cursor para hacer las consultas en SQL

        cursor.execute("SELECT id, password_hash FROM usuarios")#Seleccionamos la tabla y la información con la que vamos a estar trabajando
        usuarios = cursor.fetchall()#Obtenemos la información que buscamos
        #Con la información que sacamos entonces hacemos un recorrido usando un ciclo for
        for user in usuarios:
            id_usuario = user['id']#Donde vamos a extrar el id
            pass_plana = user['password_hash']#Y la contraseña actual SIN HACER HASH
            
            #Generamos una contraseña hasheada.
            hashed = bcrypt.generate_password_hash(pass_plana).decode('utf-8')
            #Creamos una nueva consulta y hacemos envío de la información que necesitamos
            cursor.execute(
                "UPDATE usuarios SET password_hash = %s WHERE id = %s",#Usamos %s para hacer referencia a valores
                (hashed,id_usuario)#Pasmos los valores que necesitamos sustituir, usando el id como guía entonces.
            )

            print("usuario actualizado correctamente")#En caso de completar este bloque le indicamos éxito al usuario.
        #Aseguramos que los cambios fueron realizados correctamente 
        conn.commit()
        cursor.close()#Cerramos la conexión a la base de datos
        conn.close()#Cerramos la conexión con la base de datos.
        print("Las actualizaciones fueron correctas")#Mostramos entonces que las contraseñas fueron actualizadas correctamente.
    #En caso de no poder ejecutar el bloque de instrucciones tendremos que mostrar entonces el error.
    except Exception as e:
        print(f"Error: {str(e)}")#Mostramos entonces el error

if __name__ == "__main__":
    hash_pass()