from marshmallow import Schema, fields

class registrarUsuarioSchema(Schema):
    idEmpleado = fields.String(requiered=True)
    nombre = fields.String(required=True)
    constraseña = fields.String(required=True)
    admin = fields.Bool(required=True)