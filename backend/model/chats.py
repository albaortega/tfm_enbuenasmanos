from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_CHAT_KIND_NAME = 'Chats'


class Chat(object):
    __slots__ = ['id', 'id_service', 'client_id', 'client_name', 'client_picture', 'worker_id', 'worker_name', 'worker_picture']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'id_service': self.id_service,
            'client_id': self.client_id,
            'client_name': self.client_name,
            'client_picture': self.client_picture,
            'worker_id': self.worker_id,
            'worker_name': self.worker_name,
            'worker_picture': self.worker_picture
        }


def get_chats(params):
    query = client.query(kind=DATASTORE_CHAT_KIND_NAME)
    query.add_filter(params['filter'], '=', params['value'])

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('chatNotExist')

    chats = []
    for chat_entity in results:
        chat = Chat(**chat_entity)
        chat.id = chat_entity.id
        chats.append(chat)

    return chats
