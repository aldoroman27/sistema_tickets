from flask import Flask
from flask_cors import CORS
#Rutas para hacer testeo local, cambiar las rutas de axios es importante para asegurar el testeo
"""
from routes.tickets import ticket_bp #Estas rutas solo hay que usarlas cuando estemos testeando en local y cambiamos la petición que hace axios
from routes.registro import registro_bp
"""
#Rutas de acceso para nuestra db en nube MongoDB w Atlas, implementar también en axios para el buen funcionamiento.
from routes.tickets_mongo import tickets_mongo_bp
from routes.login_mongo import auth_bp
from routes.registro_mongo import registromongo_bp

app = Flask(__name__)
#Definimos las rutas a las que se va a comunicar nuestro backend, podemos incluir la local para pruebas locales y producción.
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "http://localhost:5000",  # si haces pruebas desde ahí
    "https://backend-sistematickets.onrender.com",  # opcional, por si haces peticiones internas
    "https://<tu-frontend-en-producción>.web.app"  # remplázalo con tu dominio real
])

app.config['SECRET_KEY'] = 'mido_clave123#'#No es una secret key, no le demos importancia de momento

#Definimos nuestra ruta.
@app.route('/')
def index():
    return 'Workin´good'

#Todas nuestras funciones que tenemos disponibles dentro de nuestro backend de cada componente.
#app.register_blueprint(ticket_bp)
app.register_blueprint(auth_bp)
#app.register_blueprint(registro_bp) #QUITAR ESTE DESPUES DEL TEST
app.register_blueprint(tickets_mongo_bp)
app.register_blueprint(registromongo_bp)

#if __name__ == '__main__':
 #   app.run(debug=True)