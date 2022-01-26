from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import timedelta
from models import *

app = Flask(__name__)

api_v1_config = {
    "origins": ["*"],
    "methods": ["OPTIONS", "GET", "POST"],
    "allow_headers": ["Authorization", "Content-Type"]
}

CORS(app)

# CORS(app, resources={
    # "/*": api_v1_config
# })

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'something-secret'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
