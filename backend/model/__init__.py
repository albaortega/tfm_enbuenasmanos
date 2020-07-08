import os

from google.cloud import datastore

# Cliente de datastore para realizar las consultas.
client = datastore.Client(os.environ.get('GOOGLE_CLOUD_PROJECT'))


def entity_to_dict(entity):
    """
    Modifica una entidad a un diccionario
    :param entity: entiad de datastore
    :return: Modifica una entidad a un diccionario
    """
    if not entity:
        return None
    if isinstance(entity, list):
        entity = entity.pop()
    entity['id'] = entity.key.id
    return entity
