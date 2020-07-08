from flask import jsonify
from model.errors import ModelNotFound
from model.users import get_user, create_new_user, update_user
from model.workers import get_workers, create_new_worker, update_worker, get_worker_id, delete_worker, get_workers_to_service
from model.services import get_service_id
import logging
import datetime


def get_worker_controller(params):
    try:
        if len(params) == 0:
            workers = get_workers()
        else:
            service = get_service_id(params['service'])
            workers = get_workers_to_service(service.to_dict())
    except ModelNotFound:
        logging.info('No existen trabajadores')
        return jsonify([])

    response = []
    for worker in workers:
        worker_info = worker.to_dict()
        user_details = get_user(worker_info['email'])
        worker_info['name'] = user_details.to_dict()['name']
        worker_info['dni'] = user_details.to_dict()['dni']
        worker_info['picture'] = user_details.to_dict()['picture']
        response.append(worker_info)
    return jsonify(response)


def get_worker_controller_id(params):
    if 'id' in params.keys():
        worker = get_worker_id('id',params['id'])
    elif 'email' in params.keys():
        worker = get_worker_id('email',params['email'])
    worker_info = worker.to_dict()
    user_details = get_user(worker_info['email'])
    worker_info['name'] = user_details.to_dict()['name']
    worker_info['dni'] = user_details.to_dict()['dni']
    worker_info['picture'] = user_details.to_dict()['picture']
    return jsonify(worker_info)


def post_worker_controller(**params):
    try:
        user = get_user(params['data_user']['email'])
        if user.to_dict()['worker']:
            return jsonify(user.to_dict())
        else:
            update_user(user.to_dict()['email'], **{'worker': True})
    except ModelNotFound:
        user = create_new_user(params['data_user'])
        logging.info(user)
    worker = create_new_worker(params['data_worker'])
    return jsonify(worker.to_dict())


def patch_worker_controller(**params):
    if 'delete' in params.keys():
        if params['delete']:
            result = update_worker('id',params['id'], {'status': 'not working','final_date': datetime.datetime.now()})
            email = result.to_dict()['email']
            updated_user = update_user(email, **{'worker': False})
            return jsonify({'result': 'OK', 'name': updated_user.to_dict()['name']})
        else:
            result = update_worker('id',params['id'], {'status': 'working', 'incorporation_date': datetime.datetime.strptime(params['incorporation_date'], '%d/%m/%Y'), 'final_date': None})
            email = result.to_dict()['email']
            updated_user = update_user(email, **{'worker': True})
            return jsonify({'result': 'OK', 'name': updated_user.to_dict()['name']})
    elif 'type' in params.keys():
        if params['type'] == 'profile':
            update_worker('email',params['email'], params['data'])
            return jsonify({'result':'OK'})
    else:
        worker = update_worker('id',params['id'], params['data_worker'])
        email = worker.to_dict()['email']
        updated_user = update_user(email, **params['data_user'])
        return jsonify({'result': 'OK', 'name': updated_user.to_dict()['name']})
