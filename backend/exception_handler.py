from flask import jsonify
from werkzeug.exceptions import default_exceptions, HTTPException


def std_handler(error):
    response = jsonify(message=error.description)

    response.status_code = error.code if isinstance(error, HTTPException) else 500
    return response


class JSONExceptionHandler(object):

    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app()

    def init_app(self):
        self.register(HTTPException)
        for code, v in default_exceptions.items():
            self.register(code)

    def register(self, exception_or_code, handler=None):
        self.app.errorhandler(exception_or_code)(handler or std_handler)
