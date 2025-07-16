from flask import Flask, jsonify
from pymongo import MongoClient
from routes.tickets_mongo import get_next_id_ticket
app = Flask(__name__)

MONGO_URI = "mongodb+srv://itsupport:QovEnvcNmQRGpH5k@testit.ke5qee0.mongodb.net/"


#Hacemos la prueba de conexión.
client = MongoClient(MONGO_URI)
db = client['pruebas_mido']
coleccion = db['tickets']
