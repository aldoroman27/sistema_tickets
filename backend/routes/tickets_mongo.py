#Importamos las librerias necesarias
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import re
from datetime import datetime
import os
#Importamos de nuestro archivo login_mongo nuestra key a la db


#Declaramos nuestro blueprint
tickets_mongo_bp = Blueprint('tickets_mongo',__name__)
#Asignamos el nombre a nuestro blueprint
CORS(tickets_mongo_bp)

#Hacemos la conexión a la base de datos ubicada en mongo
client = MongoClient(os.getenv("MONGO_URI"))#Llamamos nuestra key para la conn
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


#Esta es nuestra ruta para poder agregar tickets
@tickets_mongo_bp.route('/tickets_agregar', methods=['POST'])
def crear_ticket():
    try:
        data = request.json #Recopilamos la información que necesitaremos en formato JSON 
        errores = validar_tickets(data) #Validemos que dentro de esa información se cumplan todos los requisitos para levantar un reporte

        if errores:#Si se encuentran errores entonces
            return jsonify({'errores': errores}), 400 #Retornamos error y mostramos los errores que ocurrieron

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

        coleccion_tickets.insert_one(nuevo_ticket)#Dentro de nuestra colección (tabla) insertamos nuestro nuevo ticket

        #Finalmente retornamos en json un mensaje de éxito
        return jsonify({
            'message': '✅ Ticket insertado correctamente', #Mensaje de éxito
            'idTicket': nuevo_id #Asignamos el nuevo id a nuestro ticket ID
        }), 201
    #En caso que durante el proceso se presente un error entonces
    except Exception as e:
        print("⚠️ Error al insertar ticket:", e)#Imprimimos en consola el error
        return jsonify({'error': str(e)}), 500 #Mostramos el error en formato JSON

#Esta ruta solo mostrará los tickets pendientes.
@tickets_mongo_bp.route('/tickets_pendientes', methods=['GET'])
def obtener_tickets():
    try:
        #Hacemos una consulta y además un filtrado por estado para mostrar únicamente los que tienen estado pendiente
        tickets_cursor = coleccion_tickets.find({"estado":"pendiente"})
        tickets = []#Creamos una lista de tickets para almacenarlos y al final retornarlos en formato JSON

        #Hacemos un ciclo for para recorrer cada dato que nos retorne nuestro cursor
        for ticket in tickets_cursor:
            print("Resultados de la busqueda: ",ticket)#Esto es de testeo para ver si está retornando correctamente las cosas

            ticket['mongoID'] = str(ticket['_id'])
            del ticket['_id']#Eliminamos para evitar problemas de compatibilidad.
            #Nos aseguramos que se incluya el id del ticket
            if 'idTicket' not in ticket:
                ticket['idTicket'] = "N/A"

            tickets.append(ticket)#Agregamos el ticekt que encontramos a la lista
        print(f"Total de tickets encontrados: {len(tickets)}")#Mostramos todos los tickets que tenemos en nuestra lista
        return jsonify(tickets),200 #Retornamos los valores con éxito si es que encontramos tickets existentes
    except Exception as e:#En caso de fallar entonces:
        print("Erro al obtner los tickets: ",e)#Mostramos error al obtener los tickets e imprimimos el error
        return jsonify({'message':str(e)})#Mostramos el error
    
#Esta ruta será la encarga de modificar los tickets como completados, tomando como parametro el ID del ticket que deseamos modificar.
@tickets_mongo_bp.route('/tickets/<int:id_ticket>', methods=['GET'])
def buscarTicket(id_ticket):
    try:
        ticket = coleccion_tickets.find_one({"idTicket":id_ticket})#Hacemos la búsqueda dentro de nuestra colección

        if not ticket:#Si no se encuentra el ticket entonces mostramos el mensaje correspondiente
            return jsonify({'message':f'No se encontró el ticket solicitado {id_ticket}, intente de nuevo'})#Imprimimos el mensaje correspondiente 
        ticket['_id'] = str(ticket['_id'])
        return jsonify(ticket),200# Retornamos el ticket que encontramos
    except Exception as e:#En caso de fallar en el proceso mostramos el mensaje correspondiente
        return jsonify({'error':str(e)}),500 #Mostramos el respectivo mensaje de error
    
#Definimos la nueva ruta para eliminar los tickets usando entonces el id que ya pasamos como parametro.
@tickets_mongo_bp.route('/ticket_delete/<int:id_ticket>', methods=['DELETE'])
def eliminarTicket(id_ticket):
    try:
        resultado = coleccion_tickets.delete_one({"idTicket":id_ticket})#Eliminamos de nuestra colección el ticket por su id
        print(resultado)
        #En caso de no encontrar el ticket, entonces mostramos el error
        if resultado.deleted_count == 1:
            return jsonify({'message':'Éxito al eliminar el ticket con id'}),200
        #Si encontramos el ticket entonces imprimimos el mensaje de éxito al eliminar el ticket
        else:
            return jsonify({'message':'No se encontró el ticket a eliminar, intente nuevamente'}),404
    #En caso de fallar durante el proceso mostramos el respectivo error seguido de el mensaje de error.
    except Exception as e:
        return jsonify({'message': str(e)}),500
    
#Definimos nuestra ruta para mostrar los tickets completados.
@tickets_mongo_bp.route('/tickets_completados', methods=['GET'])
def ticketsCompletados():
    try:
        #Hacemos una consulta y además un filtrado por estado para mostrar únicamente los que tienen estado completado
        tickets_cursor = coleccion_tickets.find({"estado":"completado"})
        tickets = []#Creamos una lista de tickets para almacenarlos y al final retornarlos en formato JSON

        #Hacemos un ciclo for para recorrer cada dato que nos retorne nuestro cursor
        for ticket in tickets_cursor:
            print("Resultados de la busqueda: ",ticket)#Esto es de testeo para ver si está retornando correctamente las cosas

            ticket['mongoID'] = str(ticket['_id'])
            del ticket['_id']#Eliminamos para evitar problemas de compatibilidad.
            #Nos aseguramos que se incluya el id del ticket
            if 'idTicket' not in ticket:
                ticket['idTicket'] = "N/A"

            tickets.append(ticket)#Agregamos el ticekt que encontramos a la lista
        print(f"Total de tickets encontrados: {len(tickets)}")#Mostramos todos los tickets que tenemos en nuestra lista
        return jsonify(tickets),200 #Retornamos los valores con éxito si es que encontramos tickets existentes
    except Exception as e:
        return jsonify({'message':str(e)}),500
    
#Definimos la ruta que mostrará todos los tickets, tanto pendientes como completados
@tickets_mongo_bp.route('/tickets_all', methods=['GET'])
def mostrartodosTickets():
    try:
        #Hacemos una consulta y además un filtrado por estado para mostrar únicamente los que tienen estado completado
        tickets_cursor = coleccion_tickets.find()
        tickets = []#Creamos una lista de tickets para almacenarlos y al final retornarlos en formato JSON

        #Hacemos un ciclo for para recorrer cada dato que nos retorne nuestro cursor
        for ticket in tickets_cursor:
            print("Resultados de la busqueda: ",ticket)#Esto es de testeo para ver si está retornando correctamente las cosas

            ticket['mongoID'] = str(ticket['_id'])
            del ticket['_id']#Eliminamos para evitar problemas de compatibilidad.
            #Nos aseguramos que se incluya el id del ticket
            if 'idTicket' not in ticket:
                ticket['idTicket'] = "N/A"

            tickets.append(ticket)#Agregamos el ticket que encontramos a la lista
        print(f"Total de tickets encontrados: {len(tickets)}")#Mostramos todos los tickets que tenemos en nuestra lista
        return jsonify(tickets),200 #Retornamos los valores con éxito si es que encontramos tickets existentes
    except Exception as e:
        return jsonify({'message'}),500
    
#Definimos nuestra función para poder modificar los tickets.
@tickets_mongo_bp.route('/tickets_modificar/<int:id_ticket>',methods=['PUT'])
def modificarTickets(id_ticket):
    try:
        datos = request.get_json()
        campos_a_actualizar = {}

        for campo in ['nombreCompleto', 'correoElectronico', 'departamento', 'equipo', 'descripcion']:
            if campo in datos:
                campos_a_actualizar[campo] = datos[campo]
        if not campos_a_actualizar:
            return jsonify({'message':'No se proporcionaron datos para modificar'}),400
        
        resultado = coleccion_tickets.update_one(
            {'idTicket': id_ticket},
            {'$set': campos_a_actualizar}
        )
        if resultado.matched_count == 0:
            return jsonify({'message':'No se encontró un ticket con ese ID'}),404
        else:
            return jsonify({'message':'Ticket modificado correctamente'}),200
    except Exception as e:
        print(f"Error al actualizar el ticket: {str(e)}")
        return jsonify({'message':str(e)}),500
    
#Definimos una nueva ruta para que el usuario vea el status de sus tickets
@tickets_mongo_bp.route('/mis_tickets/<id>',methods=['GET'])
def misTickets(id):
    try:
        tickets_cursor = coleccion_tickets.find({"idEmpleado":id})
        tickets = []#Creamos una lista de tickets para almacenarlos y al final retornarlos en formato JSON

        #Hacemos un ciclo for para recorrer cada dato que nos retorne nuestro cursor
        for ticket in tickets_cursor:
            print("Resultados de la busqueda: ",ticket)#Esto es de testeo para ver si está retornando correctamente las cosas

            ticket['mongoID'] = str(ticket['_id'])
            del ticket['_id']#Eliminamos para evitar problemas de compatibilidad.
            #Nos aseguramos que se incluya el id del ticket
            if 'idTicket' not in ticket:
                ticket['idTicket'] = "N/A"

            tickets.append(ticket)#Agregamos el ticekt que encontramos a la lista
        print(f"Total de tickets encontrados: {len(tickets)}")#Mostramos todos los tickets que tenemos en nuestra lista
        return jsonify(tickets),200 #Retornamos los valores con éxito si es que encontramos tickets existentes
    except Exception as e:
        print(f"Error durante el proceso {str(e)}")
        return jsonify({'message':str(e)})