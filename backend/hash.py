#Importamos la librería de flask que usa Bcrypt, que es un formato de encriptación para contraseñas
from flask_bcrypt import Bcrypt
#Importamos la conexión a nuestra base de datos.
from db import get_connection

#Definimos una instancia de Bcrypt
bcrypt = Bcrypt()

def hash_pass():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, password_hash FROM usuarios")
        usuarios = cursor.fetchall()

        for user in usuarios:
            id_usuario = user['id']
            pass_plana = user['password_hash']

            hashed = bcrypt.generate_password_hash(pass_plana).decode('utf-8')

            cursor.execute(
                "UPDATE usuarios SET password_hash = %s WHERE id = %s",
                (hashed,id_usuario)
            )

            print("usuario actualizado correctamente")

        conn.commit()
        cursor.close()
        conn.close()
        print("Las actualizaciones fueron correctas")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    hash_pass()