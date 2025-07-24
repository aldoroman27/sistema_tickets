#Importamos las librerias necesarias
from flask import Blueprint, request, jsonify #Flask para los endpoints y peticiones
from pymongo import MongoClient# pymongo para la conexión con la base de datos en mongo
from marshmallow import ValidationError #Importamos ValidationError para mostrar excepciones.
import re #No recuerdo que hacía re
from datetime import datetime, date #Importamos datetime para obtener la fecha actual.
import os #Importamos os para poder obtener las claves de nuestro .env
#Importamos nuestro schema para validar los tickets
from schemas.validarticketSchema import TicketSchema

#Creamos una instancia de nuestra clase TicketSchema.
ticket_schema = TicketSchema()

#Declaramos nuestro blueprint
tickets_mongo_bp = Blueprint('tickets_mongo',__name__)

#Hacemos la conexión a la base de datos ubicada en mongo
client = MongoClient(os.getenv("MONGO_URI"))#Llamamos nuestra key para la conn
db = client['pruebas_mido']#Seleccionamos el nombre de la db
coleccion_tickets = db['tickets']#Seleccionamos el nombre de la colección con la que vamos a trabajar

#Declaramos una función para poder obtener el id de cada ticket registrado
def get_next_ticket_id():
    counter = db.counters.find_one_and_update( #Este es el proceso de actualizar el id cada vez que se registre uno
        {"_id": "ticketid"},#Tomamos el valor del id
        {"$inc": {"sequence_value": 1}},#Aumentamos el valor a +1 cada que se registre uno nuevo
        upsert=True,  #crea el documento si no existe
        return_document=True #Regresa el documento
    )
    if counter and 'sequence_value' in counter:#Si tenemos éxito al ejecutarlo el update
        return counter['sequence_value']#Retornamos el valor del contador que sube a +1
    else:#En caso de poder hacerlo entonces
        raise Exception("No se pudo obtener el id del ticket.")#Mostramos entonces el mensaje de error que no se pudo recuperar el id del ticekt


#Esta es nuestra ruta para poder agregar tickets
@tickets_mongo_bp.route('/tickets_agregar', methods=['POST'])
def crear_ticket():
    try:
        data = request.json #Recopilamos la información que necesitaremos en formato JSON
        print(data)

        ticket_validado = ticket_schema.load(data)
        print("Ticket validado: ", ticket_validado)

        if isinstance(ticket_validado['fecha'], date):
            ticket_validado['fecha'] = datetime.combine(ticket_validado['fecha'], datetime.min.time())

        nuevo_id = get_next_ticket_id()
        ticket_validado ['idTicket'] = nuevo_id

        coleccion_tickets.insert_one(ticket_validado)
        #Finalmente retornamos en json un mensaje de éxito
        return jsonify({
            'message': '✅ Ticket insertado correctamente', #Mensaje de éxito
            'idTicket': nuevo_id #Asignamos el nuevo id a nuestro ticket ID
        }), 201
    #En caso que durante el proceso se presente un error entonces
    except ValidationError as err:
        print("ERROR DE VALIDACIÓN EN TICKET", err.messages)
        return jsonify({'message':err.messages}),400
    except Exception as e:
        print("⚠️ Error al insertar ticket:", str(e))#Imprimimos en consola el error
        return jsonify({'error': str(e)}), 500 #Mostramos el error en formato JSON

#Esta ruta solo mostrará los tickets pendientes.
@tickets_mongo_bp.route('/tickets_pendientes', methods=['GET'])
def obtener_tickets():
    try:
        #Hacemos una consulta y además un filtrado por estado para mostrar únicamente los que tienen estado pendiente
        tickets_cursor = coleccion_tickets.find({
            "estado": {"$regex": "^pendiente$", "$options": "i"}  # i = ignore case
        })
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
        print("Error al obtener los tickets: ",e)#Mostramos error al obtener los tickets e imprimimos el error
        return jsonify({'message':str(e)})#Mostramos el error
    
#Esta ruta será la encarga de buscar los tickets, tomando como parametro el ID del ticket.
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

#Definimos una nueva ruta para poder modificar los tickets y marcarlos como completados
@tickets_mongo_bp.route('/tickets_completar/<int:id_ticket>', methods=['PUT'])
def marcarCompletado(id_ticket):#Definimos nuestra función y usamos como parametro el id_ticket
    try:
        #Actualizamos el estado del ticket
        resultado = coleccion_tickets.update_one(
            {'idTicket':id_ticket},
            {'$set':{'estado':'completado'}}
        )
        #En caso de que no se encuentre ningún ticket con ese ID dentro de nuestra db, entonces mostramos error
        if resultado.matched_count == 0:
            return jsonify({'message':'No se encontó ningún ticket con ese ID'}),404
        #En caso de encontrar un ticket con ese id mostraremos mensaje de éxito.
        return jsonify({'message':'Ticket completado correctamente.'}),200
    except Exception as e:
        #En caso de tener error con el servidor, marcamos el error.
        return jsonify({'message':'Error al conectar con el servidor'}),500

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
        tickets_cursor = coleccion_tickets.find({
            "estado": {"$regex": "^completado$", "$options": "i"}  # i = ignore case
        })
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
            if 'idTicket' not in ticket:#Si no se encuentra un id en el ticket, entonces será imprimido como N/A
                ticket['idTicket'] = "N/A"

            tickets.append(ticket)#Agregamos el ticket que encontramos a la lista
        print(f"Total de tickets encontrados: {len(tickets)}")#Mostramos todos los tickets que tenemos en nuestra lista
        return jsonify(tickets),200 #Retornamos los valores con éxito si es que encontramos tickets existentes
    except Exception as e:#En caso de caer en error entonces:
        #Mostramos el respectivo mensaje de error en consola, además del mensaje que arrojó
        print(f"Error durante el proceso de mostrar tickets: {str(e)}")
        #Retornamos en formato json el mensaje del error seguido del código del error que tenemos.
        return jsonify({'message'}),500
    
#Definimos nuestra función para poder modificar los tickets.
@tickets_mongo_bp.route('/tickets_modificar/<int:id_ticket>',methods=['PUT'])
def modificarTickets(id_ticket):#Definimos entonces nuestra función para modificar los tickets con un parametro que será el id del ticket
    try:
        datos = request.get_json()#Obtenemos la información mediante un get_json()
        campos_a_actualizar = {} #definimos un diccionario para para actualizar la información correctamente
        #Hacemos un recorrido de los posibles campos a modificar
        for campo in ['nombreCompleto', 'correoElectronico', 'departamento', 'equipo', 'descripcion']:
            if campo in datos:#Si uno de los campos a modificar se encuentra dentro de nuestros datos que nos llegan
                campos_a_actualizar[campo] = datos[campo]#Lo mandamos a nuestra variable de datos
        if not campos_a_actualizar:#Si no nos llega nada de información, entonces
            #Retornamos un mensaje de que no se proporcionaron datos para modificar
            return jsonify({'message':'No se proporcionaron datos para modificar'}),400
        #Si no fue el caso entonces actualizamos nuestra tabla-colección de datos de nuestra base de datos
        resultado = coleccion_tickets.update_one(#Usamos el método update_one
            {'idTicket': id_ticket},#Seteamos el id que nos llegó
            {'$set': campos_a_actualizar}#Finalmente la inserción de los datos que nos llegó
        )
        #Si el resultado de buscar ese id del ticket no se encuentra en toda la colección
        if resultado.matched_count == 0:
            #Retornamos entonces un mensaje de error y además el respectivo error en el servidor
            return jsonify({'message':'No se encontró un ticket con ese ID'}),404
        else:
            #En caso contrario, mostraremos el mensaje de éxito en la modificación y además el mensaje de éxito en el servidor.
            return jsonify({'message':'Ticket modificado correctamente'}),200
    except Exception as e:#En caso de que fallemos entonces:
        #Mostraremos en consola el error al actualizar seguido del error que se recuperó
        print(f"Error al actualizar el ticket: {str(e)}")
        #Mostramos un mensaje de error y además mostramos el código de error en el servidor.
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
    except Exception as e:#En caso de caer en error entonces
        #Mostramos en consola el mensaje de error
        print(f"Error durante el proceso {str(e)}")
        #Retornamos un mensaje con el error y además el código de error que el servidor regresa.
        return jsonify({'message':str(e)}),500