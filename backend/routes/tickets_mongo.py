#Importamos las librerias necesarias
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import re
from datetime import datetime

#Importamos de nuestro archivo login_mongo nuestra key a la db
from .login_mongo import MONGO_URI

#Declaramos nuestro blueprint
tickets_mongo_bp = Blueprint('tickets_mongo',__name__)
#Asignamos el nombre a nuestro blueprint
CORS(tickets_mongo_bp)

#Hacemos la conexión a la base de datos ubicada en mongo
client = MongoClient(MONGO_URI)#Llamamos nuestra key para la conn
db = client['pruebas_mido']#Seleccionamos el nombre de la db
coleccion_tickets = db['tickets']#Seleccionamos el nombre de la colección con la que vamos a trabajar

#Definimos una función para validar campos
def validar_tickets(data):
    errores = [] #Creamos una lista para los posibles errores que se presenten durante la ejecución

    #Declaramos otra lista de los campos que son requeridos para poder llenar el ticket
    campos_requeridos = [
        'idEmpleado', 'nombreCompleto', 'correoElectronico',
        'departamento', 'equipo', 'descripcion', 'fecha'
    ]
    #Hacemos un recorrido dentro de los campos recorridos, si algo es faltante entonces lo mandamos a la lista de errores con el nombre del campo faltante
    for campo in campos_requeridos:
        if not data.get(campo):
            errores.append(f"Campo '{campo}' es obligatorio.")
    #En caso de que no se presente un correo con información, con @ o con .com, .mx, etc, se presentará entonces el mensaje de correo invalido
    if data.get('correoElectronico') and not re.match(r"[^@]+@[^@]+\.[^@]+",data['correoElectronico']):
        errores.append("Correo electronico ínvalido, asegurese que contenga @ y dominio (.com, .mx, etc).")
    #En caso que la longitud de la descripción sea menor a 5 entonces presentamos error
    if len(data.get('descripcion', '')) < 5:
        errores.append("La descripción debe de contener mínimo 5 caracteres.")
    #Finalmente retornamos la lista de los errores que se presentaron durante la ejecución.
    return errores

#Declaramos una función para poder obtener el id de cada ticket registrado
def get_next_ticket_id():
    counter = db.counters.find_one_and_update(
        {"_id": "ticketid"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,  #crea el documento si no existe
        return_document=True
    )
    if counter and 'sequence_value' in counter:
        return counter['sequence_value']
    else:
        raise Exception("No se pudo obtener el id del ticket.")



@tickets_mongo_bp.route('/tickets_mongo', methods=['POST'])
def crear_ticket():
    try:
        data = request.json
        errores = validar_tickets(data)

        if errores:
            return jsonify({'errores': errores}), 400

        # Generar ID autoincremental para el ticket
        nuevo_id = get_next_ticket_id()

        # Creamos el documento para MongoDB
        nuevo_ticket = {
            "idTicket": nuevo_id,
            "idEmpleado": data['idEmpleado'],
            "nombreCompleto": data['nombreCompleto'],
            "correoElectronico": data['correoElectronico'],
            "departamento": data['departamento'],
            "equipo": data['equipo'],
            "descripcion": data['descripcion'],
            "fecha": data['fecha'],  # string tipo "YYYY-MM-DD"
            "estado": data.get('estado', 'pendiente')
        }

        coleccion_tickets.insert_one(nuevo_ticket)

        return jsonify({
            'message': '✅ Ticket insertado correctamente',
            'idTicket': nuevo_id
        }), 201

    except Exception as e:
        print("⚠️ Error al insertar ticket:", e)
        return jsonify({'error': str(e)}), 500
    
@tickets_mongo_bp.route('/tickets', methods=['GET'])
def obtener_tickets():
    try:
        tickets_cursor = coleccion_tickets.find()

        tickets = []
        for ticket in tickets_cursor:
            ticket['_id'] = str(ticket['id'])
            tickets.append(ticket)
        return tickets
    except Exception as e:
        return jsonify({'message':str(e)})