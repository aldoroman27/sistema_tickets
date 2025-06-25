from flask import Flask
from flask_cors import CORS
from routes.tickets import ticket_bp


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Workin´good'

app.register_blueprint(ticket_bp)

if __name__ == '__main__':
    app.run(debug=True)