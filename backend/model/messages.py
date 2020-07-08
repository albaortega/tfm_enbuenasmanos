from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_MESSAGES_KIND_NAME = 'Messages'


class Messages(object):
    __slots__ = ['id', 'id_chat', 'date', 'from_user', 'to_user', 'msg']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'id_chat': self.id_chat,
            'date': self.date,
            'from_user': self.from_user,
            'to_user': self.to_user,
            'msg': self.msg
        }


def get_mesagges(params):
    query = client.query(kind=DATASTORE_MESSAGES_KIND_NAME, order=['date'])
    query.add_filter('id_chat', '=', params['id_chat'])

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('messagesNotExist')

    messages = []
    for message_entity in results:
        message = Messages(**message_entity)
        message.id = message_entity.id
        messages.append(message)

    return messages


def new_message(params):
    key = client.key(DATASTORE_MESSAGES_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_message_data = {
        'id_chat': str(params['id_chat']),
        'from_user': params['from_user'],
        'to_user': params['to_user'],
        'msg': params['msg'],
        'date': datetime.utcnow()
    }
    entity.update(new_message_data)

    # Se guarda en datastore.
    client.put(entity)

    message = Messages(
        **entity
    )
    message.id = entity.id
    return message
