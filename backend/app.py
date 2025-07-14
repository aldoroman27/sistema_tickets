from flask import Flask
from flask_cors import CORS
from routes.tickets import ticket_bp
from routes.login import auth_bp
from routes.registro import registro_bp
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'mido_clave123#'

@app.route('/')
def index():
    return 'Workin´good'

#Todas nuestras funciones que tenemos disponibles dentro de nuestro backend de cada componente.
app.register_blueprint(ticket_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)

if __name__ == '__main__':
    app.run(debug=True)