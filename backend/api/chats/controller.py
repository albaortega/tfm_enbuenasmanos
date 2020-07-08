from flask import jsonify
from model.errors import ModelNotFound
from model.chats import get_chats
import logging


def get_chats_controller(params):
    try:
        chats = get_chats(params)
    except ModelNotFound:
        logging.info('No existen chats')
        return jsonify([])

    response = []
    for chat in chats:
        chat_info = chat.to_dict()
        response.append(chat_info)
    return jsonify(response)


