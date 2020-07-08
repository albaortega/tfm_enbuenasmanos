from datetime import datetime

from google.cloud import datastore

from model import client, entity_to_dict
from model.errors import ModelNotFound

DATASTORE_PRICES_KIND_NAME = 'Prices'
ids = {
    '24h':  5654645158445056,
    'weekday': 5757334940811264,
    'weeknight': 5733636452122624,
    'weekendday': 5759409141579776,
    'weekendnight': 5680219105001472
}


class Price(object):
    __slots__ = ['id','service', 'price_kids', 'price_home', 'price_hospital']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        return {
            'id': self.id,
            'service': self.service,
            'price_kids': self.price_kids,
            'price_home': self.price_home,
            'price_hospital': self.price_hospital
        }


def get_prices():
    query = client.query(kind=DATASTORE_PRICES_KIND_NAME)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('pricesNotExist')

    prices = []
    for price_entity in results:
        price = Price(**price_entity)
        price.id = price_entity.id
        prices.append(price)

    return prices


def update_price(id, data):
    key = client.key(DATASTORE_PRICES_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_PRICES_KIND_NAME)
    query.add_filter('__key__', '=', key)

    results = list(query.fetch())
    if not results:
        raise ModelNotFound('priceNotExist')

    entity = results[0]

    # Se crea la entidad y se sustituye el cambio.
    entity.update(data)

    # Se actualiza en datastore.
    client.put(entity)

    # Se devuelve el objeto que representa al usuario.
    updated_price = Price(
        **entity
    )
    updated_price.id = entity.id
    return updated_price
