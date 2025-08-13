from marshmallow import Schema, fields

#Definimos nuestro schema para validar nuestros campos de incidencias.
class validarIncidenciaSchema(Schema):
    idEmpleado = fields.String(required=True)
    nombreCompleto = fields.String(required=True)
    puesto = fields.String(required=True)
    departamento = fields.String(required=True)
    justificacion = fields.String(required=True)
    fecha = fields.Date(required=True)
    tipoIncidencia = fields.String(required=True)
    estado = fields.String(required=True)
