from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI = "mongodb+srv://itsupport:QovEnvcNmQRGpH5k@testit.ke5qee0.mongodb.net/"


#Hacemos la prueba de conexión.
client = MongoClient(MONGO_URI)
db = client['pruebas_mido']
coleccion = db['usuarios']

resultado = coleccion.insert_one({'id':'17','nombre':"Aldo", "admin":True, 'password_hash':'$2b$12$lXmN6LsQV3yYe64xnLpvfufDsDi9Cvgn4.RV4meJChClaRiFH99mK'})
print("Documento insertado con el ID: ", resultado.inserted_id)

for usuario in coleccion.find():
    print(usuario)