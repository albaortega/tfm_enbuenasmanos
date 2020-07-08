from google.cloud import datastore

from model import client
from model.errors import ModelNotFound

import datetime

from model.workers import update_worker

DATASTORE_SERVICES_KIND_NAME = 'Services'


class Service(object):
    __slots__ = ['id', 'client', 'phone', 'user', 'address', 'start_date', 'end_date', 'open_end_date', 'status', 'type','worker','occupation_type','rejected_by','schedule','created']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        try:
            occupation_type = self.occupation_type
        except:
            occupation_type = None
        try:
            schedule = self.schedule
        except:
            schedule = None
        return {
            'id': self.id,
            'client': self.client,
            'phone': self.phone,
            'user': self.user,
            'address': self.address,
            'start_date': self.start_date.strftime('%d/%m/%Y'),
            'end_date': self.end_date.strftime('%d/%m/%Y'),
            'open_end_date': self.open_end_date,
            'status': self.status,
            'type': self.type,
            'occupation_type': occupation_type,
            'schedule': schedule,
            'worker': self.worker,
            'rejected_by': self.rejected_by
        }


def create_new_service(data):
    key = client.key(DATASTORE_SERVICES_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_service_data = {
        'client': data['client'],
        'phone': data['phone'],
        'user': data['user'],
        'address': data['address'],
        'start_date': datetime.datetime.strptime(data['start_date'], '%d/%m/%Y'),
        'end_date': datetime.datetime.strptime(data['end_date'], '%d/%m/%Y'),
        'open_end_date': data['open_end_date'],
        'status': 'pending',
        'type': data['type'],
        'worker': None,
        'occupation_type': data['occupation_type'],
        'schedule': data['schedule'],
        'rejected_by': [],
        'created': datetime.datetime.now()
    }
    entity.update(new_service_data)

    # Se guarda en datastore.
    client.put(entity)

    service = Service(
        **entity
    )
    service.id = entity.id
    return service


def get_services(email=None, filter=None, status=None, order=None):
    if order is not None:
        query = client.query(kind=DATASTORE_SERVICES_KIND_NAME, order=['start_date'])
    else:
        query = client.query(kind=DATASTORE_SERVICES_KIND_NAME,  order=['-start_date'])
    if email is not None:
        query.add_filter(filter, '=', email)
    if status is not None:
        query.add_filter('status', '=', status)

    results = list(query.fetch())

    if not results:
        raise ModelNotFound('userNotExist')

    services = []
    for service_entity in results:
        phone = Service(**service_entity)
        phone.id = service_entity.id
        services.append(phone)

    return services


def get_service_id(id):
    key = client.key(DATASTORE_SERVICES_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_SERVICES_KIND_NAME)
    query.add_filter('__key__', '=', key)

    people_entities = list(query.fetch())

    entity = people_entities[0]
    service = Service(**entity)
    service.id = entity.id

    return service


def update_service(id, data):
    key = client.key(DATASTORE_SERVICES_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_SERVICES_KIND_NAME)
    query.add_filter('__key__', '=', key)

    results = list(query.fetch())
    if not results:
        raise ModelNotFound('serviceNotExist')

    entity = results[0]

    if 'rejected_by' in data.keys():
        user = data['rejected_by']
        service = Service(**entity)
        service.id = entity.id
        rejected_by = service.to_dict()['rejected_by']
        rejected_by.append(user)
        data['rejected_by'] = rejected_by

    if data['status'] == 'accepted':
        service = Service(**entity)
        service.id = entity.id
        service_info = service.to_dict()
        schedule = service_info['schedule']
        worker = service_info['worker']
        update_worker('email', worker, {'schedule': schedule})
    entity.update(data)

    client.put(entity)

    updated_service = Service(
        **entity
    )
    updated_service.id = entity.id
    return updated_service
