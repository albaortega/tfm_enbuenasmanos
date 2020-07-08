from logging.config import dictConfig

import firebase_admin
from flask import Flask
from flask.logging import default_handler

from api.prices.routes import price_blueprint
from api.services.routes import service_blueprint
from api.users.routes import user_blueprint
from api.workers.routes import worker_blueprint
from api.chats.routes import chat_blueprint
from api.messages.routes import message_blueprint
from exception_handler import *

try:
  import googleclouddebugger
  googleclouddebugger.enable()
except ImportError:
  pass

# Se configura el logging de la aplicación.
dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] [%(levelname)s] [%(filename)s:%(funcName)s:%(lineno)s] - %(message)s',
        }
    },
    'handlers': {
        'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default'
        }
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})


# Aplicación de Flask que sirve la API.
app = Flask(__name__)

# Exception handler
handler = JSONExceptionHandler(app)

app.logger.removeHandler(default_handler)

# Se inicializa firebase admin.
default_app = firebase_admin.initialize_app()

# Prefijo para todas los endpoints de la API.
FLASK_API_PREFIX = '/api'

# Blueprints de la API.
app.register_blueprint(user_blueprint, url_prefix=FLASK_API_PREFIX + '/user')
app.register_blueprint(service_blueprint, url_prefix=FLASK_API_PREFIX + '/service')
app.register_blueprint(worker_blueprint, url_prefix=FLASK_API_PREFIX + '/worker')
app.register_blueprint(price_blueprint, url_prefix=FLASK_API_PREFIX + '/price')
app.register_blueprint(chat_blueprint, url_prefix=FLASK_API_PREFIX + '/chat')
app.register_blueprint(message_blueprint, url_prefix=FLASK_API_PREFIX + '/message')
