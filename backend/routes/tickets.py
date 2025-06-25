from flask import Blueprint, request, jsonify
from db import get_connection

ticket_bp = Blueprint('tickets',__name__)
@ticket_bp.route('/tickets', methods=['POST'])

#Definimos nustra función para crear tickets
def crear_ticket():
    data = request.json
    conn = get_connection() #Hacemos conexión a la base de datos
    cursor = conn.cursor()

    #Añadimos la información haciendo uso de un qery de información SQL
    sql = """
        INSERT INTO tickets
        (idEmpleado, nombreCompleto, correoElectronico, departamento, equipo, descripcion, fecha, estado)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """
    #Pasamos como parametros los valores que se requieren dentro de la tabla
    values = (
        data['idEmpleado'],
        data['nombreCompleto'],
        data['correoElectronico'],
        data['departamento'],
        data['equipo'],
        data['descripcion'],
        data['fecha'],
        data.get('estado','pendiente')
    )

    #Ejecuta el envió de información con la instrucción qery y además los valores concatenados
    cursor.execute(sql, values)
    #Hacemos el commit a la base de datos
    conn.commit()
    #Terminamos la conexión con la base de datos
    conn.close()

    #Mostramos un mensaje en formato JSON que dirá que el mensaje fue insertado correctamente junto con el valor 201 (éxito)
    return jsonify({'message': '✅ Ticket insertado correctamente'}),201