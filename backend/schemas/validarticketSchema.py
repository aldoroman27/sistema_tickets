#Importamos la libreria de marshmallow que nos ayudará con las validaciones de los campos requeridos, facilita el code y hace más fácil de entender
from marshmallow import Schema, fields, validate

#Definimos una clase de tipo TicketSchema, que validará cada uno de los campos que le vamos a pasar como parametro
class TicketSchema(Schema):
    idEmpleado = fields.String(required=True)
    nombreCompleto = fields.String(required=True)
    correoElectronico = fields.Email(required=True)
    departamento = fields.String(required=True)
    equipo = fields.String(required=True)
    descripcion = fields.String(required=True, validate=validate.Length(min=5))
    fecha = fields.String(required=True)
    estado = fields.String(load_default="pendiente")
