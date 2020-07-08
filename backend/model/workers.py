from google.cloud import datastore

from model import client
from model.errors import ModelNotFound

import datetime

DATASTORE_WORKERS_KIND_NAME = 'Workers'


class Worker(object):
    __slots__ = ['id', 'email', 'phone', 'status', 'incorporation_date', 'final_date', 'free', 'created', 'type', 'accept_more_services', 'schedule']

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if key != 'id':
                setattr(self, key, value)

    def to_dict(self):
        try:
            final_date = self.final_date.strftime('%d/%m/%Y')
        except:
            final_date = None
        return {
            'id': self.id,
            'email': self.email,
            'phone': self.phone,
            'status': self.status,
            'incorporation_date': self.incorporation_date.strftime('%d/%m/%Y'),
            'final_date': final_date,
            'free': self.free,
            'type': self.type,
            'accept_more_services': self.accept_more_services,
            'schedule': self.schedule
        }


def create_new_worker(data):
    key = client.key(DATASTORE_WORKERS_KIND_NAME)
    entity = datastore.Entity(key=key)
    new_worker_data = {
        'email': data['email'],
        'phone': data['phone'],
        'status': 'working',
        'incorporation_date': datetime.datetime.strptime(data['incorporation_date'], '%d/%m/%Y'),
        'final_date': None,
        'free': True,
        'type': data['type'],
        'created': datetime.datetime.now(),
        'accept_more_service': True,
        'schedule': []
    }
    entity.update(new_worker_data)

    # Se guarda en datastore.
    client.put(entity)

    worker = Worker(
        **entity
    )
    worker.id = entity.id
    return worker


def get_workers():
    query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
    results = list(query.fetch())

    if not results:
        raise ModelNotFound('workerNotExist')

    workers = []
    for worker_entity in results:
        worker = Worker(**worker_entity)
        worker.id = worker_entity.id
        workers.append(worker)

    return workers


def get_worker_id(filter, value):
    if filter == 'id':
        key = client.key(DATASTORE_WORKERS_KIND_NAME, int(value))
        query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
        query.add_filter('__key__', '=', key)
    elif filter == 'email':
        query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
        query.add_filter('email', '=', value)

    worker_entities = list(query.fetch())

    entity = worker_entities[0]
    worker = Worker(**entity)
    worker.id = entity.id

    return worker


def update_worker(filter, id, data):
    if filter=='id':
        key = client.key(DATASTORE_WORKERS_KIND_NAME, int(id))
        query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
        query.add_filter('__key__', '=', key)
    if filter=='email':
        query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
        query.add_filter('email', '=', id)

    results = list(query.fetch())
    if not results:
        raise ModelNotFound('serviceNotExist')

    entity = results[0]

    if 'schedule' in data.keys():
        worker = Worker(**entity)
        worker.id = entity.id
        schedule = worker.to_dict()['schedule']
        schedule.append(data['schedule'])
        data['schedule'] = schedule
    entity.update(data)

    client.put(entity)

    updated_worker = Worker(
        **entity
    )
    updated_worker.id = entity.id
    return updated_worker


def delete_worker(id):
    key = client.key(DATASTORE_WORKERS_KIND_NAME, int(id))
    query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
    query.add_filter('__key__', '=', key)

    address_entities = list(query.fetch())

    if not address_entities:
        raise ModelNotFound('workerotExist')

    entity = address_entities[0]
    deleted_worker = Worker(
        **entity
    )
    deleted_worker.id = entity.id

    client.delete(entity.key)

    return {'result': 'OK', 'email': deleted_worker.to_dict()['email']}


def get_workers_to_service(service):
    query = client.query(kind=DATASTORE_WORKERS_KIND_NAME)
    query.add_filter('status', '=', 'working')
    results = list(query.fetch())

    if not results:
        raise ModelNotFound('workerNotExist')

    workers = []
    for worker_entity in results:
        worker = Worker(**worker_entity)
        worker.id = worker_entity.id
        if(service['type'] in worker.to_dict()['type']) and\
            (worker.to_dict()['email'] not in service['rejected_by']) and \
            worker.to_dict()['accept_more_services']:
            workers.append(worker)

    return workers
