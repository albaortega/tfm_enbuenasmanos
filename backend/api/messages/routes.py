import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.messages.controller import get_messages_controller, post_messages_controller


message_blueprint = Blueprint(
    'messages',
    __name__
)


@message_blueprint.route('', methods=['GET', 'POST'])
def manage_message():
    logging.info('Se hace una petición %s al endpoint /api/message', request.method)

    if request.method == 'GET':
        return _manage_messages_get()
    elif request.method == 'POST':
        return _manage_messages_post()
    else:
        raise NotImplemented('Method not valid')


def _manage_messages_get():
    params = request.args
    return get_messages_controller(params)


def _manage_messages_post():
    params = request.json
    return post_messages_controller(params)
