from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_PEOPLE_KIND_NAME = 'AssociatedPeople'


class AssociatedPerson(object):
    __slots__ = ['id', 'client', 'name', 'age', 'dependence', 'disability', 'desc_disability', 'pattern', 'observations', 'type']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'client': self.client,
            'name': self.name,
            'age': self.age,
            'dependence': self.dependence,
            'disability': self.disability,
            'desc_disability': self.desc_disability,
            'pattern': self.pattern,
            'observations': self.observations,
            'type': self.type
        }


def create_new_person(data, email):
    key = client.key(DATASTORE_PEOPLE_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_user_data = {
        'client': email,
        'name': data['name'],
        'age': data['age'],
        'dependence': data['dependence'] or None,
        'disability': data['disability'] or None,
        'desc_disability': data['desc_disability'],
        'pattern': data['pattern'] or None,
        'observations': data['observations'],
        'type': data['type']
    }
    entity.update(new_user_data)

    # Se guarda en datastore.
    client.put(entity)

    person = AssociatedPerson(
        **entity
    )
    person.id = entity.id
    return person


def get_people(email):
    query = client.query(kind=DATASTORE_PEOPLE_KIND_NAME)
    query.add_filter('client', '=', email)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('userNotExist')

    user_people = []
    for user_entity in results:
        person = AssociatedPerson(**user_entity)
        person.id = user_entity.id
        user_people.append(person)

    return user_people


def get_people_id(id):
    key = client.key(DATASTORE_PEOPLE_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_PEOPLE_KIND_NAME)
    query.add_filter('__key__', '=', key)

    people_entities = list(query.fetch())

    entity = people_entities[0]
    person = AssociatedPerson(**entity)
    person.id = entity.id

    return person


def delete_person(id):
    key = client.key(DATASTORE_PEOPLE_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_PEOPLE_KIND_NAME)
    query.add_filter('__key__', '=', key)

    people_entities = list(query.fetch())

    if not people_entities:
        raise ModelNotFound('personNotExist')

    entity = people_entities[0]

    client.delete(entity.key)

    return {'result': 'OK'}


def update_person(email, data):
    """
    Actualiza la información del lenguaje de un usuario en datastore.
    :param new_lang: Nuevo lenguaje de. usuario.
    :return: objeto de la clase User
    """
    query = client.query(kind=DATASTORE_PEOPLE_KIND_NAME)
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
    updated_person = AssociatedPerson(
        **entity
    )
    updated_person.id = entity.id
    return updated_person
