from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_USERS_KIND_NAME = 'Users'


class User(object):
    __slots__ = ['id', 'email', 'name', 'dni', 'admin', 'worker', 'user', 'language', 'picture', 'created']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'dni': self.dni,
            'language': self.language,
            'admin': self.admin,
            'user': self.user,
            'worker': self.worker,
            'picture': self.picture
        }


def get_user(email):
    query = client.query(kind=DATASTORE_USERS_KIND_NAME)
    query.add_filter('email', '=', email)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('userNotExist')

    entity = results[0]

    # Se devuelve el objeto que representa el usuario.
    user = User(
        **entity
    )
    user.id = entity.id
    return user


def create_new_user(params):
    key = client.key(DATASTORE_USERS_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_user_data = {
        'email': params['email'],
        'dni': params['dni'],
        'name': params['name'],
        'language': 'es',
        'admin': (True if params['admin'] else False) if 'admin' in params.keys() else False,
        'user': (True if params['user'] else False) if 'user' in params.keys() else False,
        'worker': (True if params['worker'] else False) if 'worker' in params.keys() else False,
        'created': datetime.now(),
        'picture': params['picture']
    }
    entity.update(new_user_data)

    # Se guarda en datastore.
    client.put(entity)

    user = User(
        **entity
    )
    user.id = entity.id
    return user


def update_user(email, **data):
    """
    Actualiza la información del lenguaje de un usuario en datastore.
    :param new_lang: Nuevo lenguaje de. usuario.
    :return: objeto de la clase User
    """
    query = client.query(kind=DATASTORE_USERS_KIND_NAME)
    query.add_filter('email', '=', email)

    results = list(query.fetch())
    if not results:
        raise ModelNotFound('userNotExist')

    entity = results[0]

    # Se crea la entidad y se sustituye el cambio.
    entity.update(data)

    # Se actualiza en datastore.
    client.put(entity)

    # Se devuelve el objeto que representa al usuario.
    updated_user = User(
        **entity
    )
    updated_user.id = entity.id
    return updated_user


def get_admins():
    query = client.query(kind=DATASTORE_USERS_KIND_NAME)
    query.add_filter('admin', '=', True)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('userNotExist')

    users = []
    for user_entity in results:
        user = User(**user_entity)
        user.id = user_entity.id
        users.append(user)

    return users



