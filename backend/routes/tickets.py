from flask import Blueprint, request, jsonify
from db import get_connection
import re

#Bluepr
ticket_bp = Blueprint('tickets',__name__)

#Definimos una función para validar campos
def validar_tickets(data):
    errores = []

    campos_requeridos = [
        'idEmpleado', 'nombreCompleto', 'correoElectronico',
        'departamento', 'equipo', 'descripcion', 'fecha'
    ]
    
    for campo in campos_requeridos:
        if not data.get(campo):
            errores.append(f"Campo '{campo}' es obligatorio.")
    
    if data.get('correoElectronico') and not re.match(r"[^@]+@[^@]+\.[^@]+",data['correoElectronico']):
        errores.append("Correo electronico ínvalido.")

    if len(data.get('descripción', '')) < 5:
        errores.append("La descripción debe de contener mínimo 5 caracteres.")
    
    return errores

@ticket_bp.route('/tickets', methods=['POST'])
#Definimos nustra función para crear tickets
def crear_ticket():
    #Intentamos hacer la conexión con la base de datos
    try:
        data = request.json
        errores = validar_tickets(data)

        if errores:
            return jsonify({'errores': errores}), 400
        
        conn = get_connection() #Hacemos conexión a la base de datos
        cursor = conn.cursor()#Esta variable lo que hará es almacenar cada columna como un diccionario, las llaves de cada objeto dentro son los nombres de las columnas de MYSQL
        #Añadimos la información haciendo uso de un qery de información SQL
        sql = """
            INSERT INTO tickets
            (idEmpleado, nombreCompleto, correoElectronico, departamento, equipo, descripcion, fecha, estado)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """
        #Pasamos como parametros los valores que se requieren dentro de la tabla
        #Estos valores deberán de estar en un formato JSON, usando alguna herramienta como POSTMAN
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
        #Guardamos el útlimo id generado
        nuevo_id = cursor.lastrowid
        #Hacemos el commit a la base de datos
        conn.commit()
        #Terminamos la conexión con la base de datos
        conn.close()

        #Mostramos un mensaje en formato JSON que dirá que el mensaje fue insertado correctamente junto con el valor 201 (éxito)
        return jsonify({
                        'message': '✅ Ticket insertado correctamente',
                        'idTicket': nuevo_id
                        }),201
    except Exception as e: #En caso de fallar mandamos una exception con la información del error
        if conn:
            conn.close()
        return jsonify({'error':str(e)}),500 #Mostramos el código 500 que significa error en el servidor.

#Definimos nuestra función para poder mostrar nuestro tickets, en este caso será para tickets pendientes.
@ticket_bp.route('/tickets', methods=['GET'])
#Definimos nuestra función de obtner tickets
def obtenerTickets():
    #Intentamos una conexión a la base de datos
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True) #Antes False
        cursor.execute("SELECT * FROM tickets")#Hacemos la consulta en SQL
        tickets = cursor.fetchall()#Obtenemos toda la información
        cursor.close()
        return jsonify(tickets)#Retornamos un formato en JSON de los tickets que tenemos disponibles
    except Exception as e:#Lanzamos una exception en caso de fallar
        if conn:
            conn.close()
        return jsonify({"error":str(e)}),500 #Mostramos un mensaje de erro además de mostrar error en el servidor.

#Hacemos la petición a nuestra ruta dentro de nuestro servidor.
@ticket_bp.route('/tickets/<int:idTicket>', methods=['GET'])
#Definimos nuestra función para buscar nuestros tickets
def buscarTicket(idTicket):
    try:
        conn = get_connection()#Conexión a la base de datos
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM tickets WHERE idTicket = %s",(idTicket,))#Hacemos nuestra consulta
        ticket = cursor.fetchone() #
        cursor.close()
        conn.close()

        if ticket:
            return jsonify(ticket),200
        else:
            return jsonify({'message': "Ticket no encontrado!"}),404
        pass
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error':str(e)}),500 #Mostramos en caso de fallar error a la conexión del servidor.

@ticket_bp.route('/tickets/<int:idTicket>', methods=['DELETE'])
def eliminarTicket(idTicket):
    try:
        conn = get_connection()#Nos conectamos a la base de datos
        cursor = conn.cursor(dictionary=True)

        cursor.execute("DELETE FROM tickets WHERE idTicket = %s",(idTicket,))#Pasamos nuestro promp a eliminar
        conn.commit()
        filas_afectadas = cursor.rowcount #Cuantos registros fueron eliminados
        
        cursor.close()
        conn.close()#Cerramos la conexión con la base de datos
        
        #Si se vieron filas afectadas entonces quiere decir que la eliminación fue correcta
        if filas_afectadas > 0:
            return jsonify({'message': "Ticket eliminado correctamente"}),200
        #En caso de no tener nada afectado, retornamos mensaje de error en la búsqueda
        else:
            return jsonify({'message':"error no encontramos el ticket que buscabas"}),404
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}),500 #Mostramos el error en caso de fallar y lo mostramos como error de servidor

#Indicamos la ruta que vamos a seguir además de la búsqueda de un ticket y el método que vamos a utilizar.
@ticket_bp.route('/tickets/<int:idTicket>', methods=['PUT'])
def modificarTicket(idTicket):
    try:
        conn = get_connection() #Hacemos la conexión a la base de datos
        cursor = conn.cursor(dictionary=True)
        data = request.json #Haremos un request en formato JSON
        
        campos_actualizables = ['nombreCompleto', 'correoElectronico', 'departamento','equipo','descripcion','fecha','estado']

        #Creamos una consulta dinamicamente en SQL solo con los campos enviados
        updates = []
        valores = []

        #Recorremos nuestra lista par encontrar los valores a modificar y lo asignamos con %s
        for campo in campos_actualizables:
            if campo in data:
                updates.append(f"{campo} = %s")
                valores.append(data[campo])
        if not updates:#En caso de no encontrar nada mandamos un error.
            return jsonify({'message':"no se enviaron datos para cambiar"}),400
        
        #Agregamos en caso de modificar el ID al final
        valores.append(idTicket)

        #Hacemos la consulta en SQL
        sql = f"UPDATE tickets SET {', '.join(updates)} WHERE idTicket = %s"
        cursor.execute(sql, valores)#Ejecutamos el qery 
        conn.commit()
        filas_afectadas = cursor.rowcount#Contamos las filas afectadas/actualizadas
        cursor.close()
        conn.close()#Cerramos la conexión
        #En caso de mostrar filas afectadas mostramos un mensaje de éxito
        if filas_afectadas > 0:
            return jsonify({'message':"Ticket actualizado correctamente!"}),200
        #En caso contrario mostramos que no se encontró el ticket
        else:
            return jsonify({'message':"Ticket no encontrado"}),404
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

#Esta función nos ayudará a mostrar los tickets que tenemos pendientes, usando el método pendientes y además GET  
@ticket_bp.route('/ticket/pendientes',methods=['GET'])
def ticketsPendientes():
    try:
        conn = get_connection()#Hacemos la conexión a nuestra base de datos
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM tickets WHERE estado = 'pendiente'")#Indicamos que solo queremos los que tienen como estado pendiente
        tickets = cursor.fetchall()#Almacenamos los resultados
        cursor.close()#Cerramos la conexión
        conn.close()#Cerramos la conexión a la base de datos

        #Si se encontraron tickets entonces los mostramos en formato JSON y mostramos código de éxito 200
        if tickets:
            return jsonify(tickets),200
        #En caso de no encontrar tickets pendientes entonces mostramos el respectivo mensaje.
        else:
            return jsonify({'message':'No hay tickets pendientes'}),200
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'message':str(e)}),500#En caso de que algo falle mostramos el respectivo mensaje y error en el servidor

#Ahora creamos la función de tickets completados, usando nuevamente el método GET    
@ticket_bp.route('/ticket/completados',methods=['GET'])
def ticketsCompletados():
    try:
        conn = get_connection()#Hacemos la conexión con la base de datos
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM tickets WHERE estado = 'completado'")#Ejecutamos el qery usando como filtro el estado de completado
        tickets = cursor.fetchall()#Almacenamos los resultados
        cursor.close()#Cerramos la conexión
        conn.close()#Cerramos la conexión con la base de datos

        #Si se encontraron tickets entonces mostramos el respectivo mensaje
        if tickets:
            return jsonify(tickets),200
        else:#En caso de no encontrar mostramos el mensaje de error en el servidor
            return jsonify({'message':'No hay tickets completados'}),200
    except Exception as e:#En caso de fallar durante el proceso mostramos el respectivo mensaje, con error en el servidor.
        if conn:
            conn.close()
        return jsonify({'message':str(e)}),500
    
#Definimos una nueva ruta para mostrar los tickets usando como guía el ID de los usuarios
#Usamos entonces la ruta con el método get
@ticket_bp.route('/tickets/usuario/<idEmpleado>', methods=['GET'])
def obtener_tickets_usuario(idEmpleado):
    try:
        conn = get_connection()#Hacemos la conexión a la bd
        cursor = conn.cursor(dictionary=True)#Creamos un cursor para hacer las consultas
        cursor.execute("SELECT * FROM tickets WHERE idEmpleado = %s", (idEmpleado,))#Creamos la consulta y pasamos como parametro el idempleado
        tickets = cursor.fetchall()#Obtenemos los resultados arrojados.
        cursor.close()#Cerramos la consulta
        conn.close()#Cerramos la conexión
        return jsonify(tickets), 200#Mostramos que fue éxitosa la consulta
    except Exception as e:
        return jsonify({'error': str(e)}), 500#En caso de fallar mostramos el error.
