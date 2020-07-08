import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.chats.controller import get_chats_controller


chat_blueprint = Blueprint(
    'chats',
    __name__
)


@chat_blueprint.route('', methods=['GET'])
def manage_worker():
    logging.info('Se hace una petición %s al endpoint /api/chats', request.method)

    if request.method == 'GET':
        return _manage_chats_get()
    else:
        raise NotImplemented('Method not valid')


def _manage_chats_get():
    params = request.args
    return get_chats_controller(params)

