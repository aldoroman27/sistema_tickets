from flask import Flask,Blueprint, request, jsonify
from db import get_connection
from flask_bcrypt import Bcrypt
from flask_cors import CORS

bcrypt = Bcrypt()

auth_bp = Blueprint('auth',__name__)
CORS(auth_bp)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        data = request.json
        id_usuario = data.get('id')
        password = data.get('contrasena')

        # Buscar usuario en la base de datos
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id_usuario,))
        usuario = cursor.fetchone()
        cursor.close()
        conn.close()

        # Validar credenciales SIN hasheo
        #if usuario and bcrypt.check_password_hash(usuario['password_hash'], password) #Implementar cuando tengamos hasheadas las pass
        if usuario and usuario['password_hash'] == password:  # ← comparación directa
            return jsonify({
                'id': usuario['id'],
                'nombre': usuario['usuario'],
                'admin': usuario['admin']
            }), 200
        else:
            return jsonify({'message': 'Error, verifique nuevamente su información'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
