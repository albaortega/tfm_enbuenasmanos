from flask import jsonify
from model.errors import ModelNotFound
from model.messages import get_mesagges, new_message
import logging


def get_messages_controller(params):
    try:
        messages = get_mesagges(params)
    except ModelNotFound:
        logging.info('No existen mensajes')
        return jsonify([])

    response = []
    for message in messages:
        message_info = message.to_dict()
        response.append(message_info)
    return jsonify(response)


def post_messages_controller(params):
    message = new_message(params)
    return jsonify(message.to_dict())


