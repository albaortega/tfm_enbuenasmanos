from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_PHONES_KIND_NAME = 'Phones'


class Phone(object):
    __slots__ = ['id', 'number', 'user']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user,
            'number': self.number
        }


def create_new_phone(phone, email):
    key = client.key(DATASTORE_PHONES_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_user_data = {
        'number': phone,
        'user': email
    }
    entity.update(new_user_data)

    # Se guarda en datastore.
    client.put(entity)

    phone = Phone(
        **entity
    )
    phone.id = entity.id
    return phone


def get_phones(email):
    query = client.query(kind=DATASTORE_PHONES_KIND_NAME)
    query.add_filter('user', '=', email)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('userNotExist')

    user_phones = []
    for user_entity in results:
        phone = Phone(**user_entity)
        phone.id = user_entity.id
        user_phones.append(phone)

    return user_phones


def delete_phone(id):
    key = client.key(DATASTORE_PHONES_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_PHONES_KIND_NAME)
    query.add_filter('__key__', '=', key)

    phone_entities = list(query.fetch())

    if not phone_entities:
        raise ModelNotFound('phoneNotExist')

    entity = phone_entities[0]

    client.delete(entity.key)

    return {'result': 'OK'}


