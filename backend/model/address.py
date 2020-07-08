from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_ADDRESS_KIND_NAME = 'Addresses'


class Address(object):
    __slots__ = ['id', 'client', 'street', 'number', 'portal', 'piso', 'cp', 'locality', 'city', 'country', 'aditional', 'address', 'type', 'floor', 'room']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'client': self.client,
            'street': self.street,
            'number': self.number,
            'portal': self.portal,
            'piso': self.piso,
            'cp': self.cp,
            'locality': self.locality,
            'city': self.city,
            'country': self.country,
            'aditional': self.aditional,
            'address': self.address,
            'type': self.type,
            'floor': self.floor,
            'room': self.room
        }


def create_new_address(data, email):
    key = client.key(DATASTORE_ADDRESS_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_user_data = {
        'client': email,
        'street': data['street'],
        'number': data['number'],
        'portal': data['portal'],
        'piso': data['piso'],
        'cp': data['cp'],
        'locality': data['locality'],
        'city': data['city'],
        'country': data['country'],
        'aditional': data['aditional'],
        'address': data['address'],
        'type': data['type'],
        'floor': data['floor'],
        'room': data['room']
    }
    entity.update(new_user_data)

    # Se guarda en datastore.
    client.put(entity)

    address = Address(
        **entity
    )
    address.id = entity.id
    return address


def get_addresses(email):
    query = client.query(kind=DATASTORE_ADDRESS_KIND_NAME)
    query.add_filter('client', '=', email)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('addressNotExist')

    user_addresses = []
    for user_entity in results:
        address = Address(**user_entity)
        address.id = user_entity.id
        user_addresses.append(address)

    return user_addresses


def get_address_id(id):
    key = client.key(DATASTORE_ADDRESS_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_ADDRESS_KIND_NAME)
    query.add_filter('__key__', '=', key)

    adresses_entities = list(query.fetch())

    entity = adresses_entities[0]
    address = Address(**entity)
    address.id = entity.id

    return address


def delete_address(id):
    key = client.key(DATASTORE_ADDRESS_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_ADDRESS_KIND_NAME)
    query.add_filter('__key__', '=', key)

    address_entities = list(query.fetch())

    if not address_entities:
        raise ModelNotFound('addressNotExist')

    entity = address_entities[0]

    client.delete(entity.key)

    return {'result': 'OK'}



def update_address(email, data):
    """
    Actualiza la información del lenguaje de un usuario en datastore.
    :param new_lang: Nuevo lenguaje de. usuario.
    :return: objeto de la clase User
    """
    query = client.query(kind=DATASTORE_ADDRESS_KIND_NAME)
    query.add_filter('client', '=', email)

    results = list(query.fetch())
    if not results:
        raise ModelNotFound('userNotExist')

    entity = results[0]

    # Se crea la entidad y se sustituye el cambio.
    entity.update(data)

    # Se actualiza en datastore.
    client.put(entity)

    # Se devuelve el objeto que representa al usuario.
    updated_address = Address(
        **entity
    )
    updated_address.id = entity.id
    return updated_address
