
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app
