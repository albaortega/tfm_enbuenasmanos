
from flask import jsonify

from api.users.controller import get_user_config_id_controller, get_user_profile_controller
from api.workers.controller import get_worker_controller_id
from model.errors import ModelNotFound
from model.services import get_services, create_new_service, update_service, get_service_id
import logging

from model.users import get_user
from model.workers import update_worker


def get_service_controller(**params):
    try:
        if 'status' in params.keys() and 'email' in params.keys():
            if 'order' in params.keys():
                services = get_services(params['email'], params['filter'], params['status'], params['order'])
            else:
                services = get_services(params['email'], params['filter'], params['status'])
        elif 'status' in params.keys() and 'email' not in params.keys():
            if 'order' in params.keys():
                services = get_services(status=params['status'], order=params['order'])
            else:
                services = get_services(status=params['status'])
        elif 'status' not in params.keys() and 'email' in params.keys():
            services = get_services(params['email'], params['filter'])
        else:
            services = get_services()
    except ModelNotFound:
        logging.info('No existen servicios')
        return jsonify([])

    response = []
    for service in services:
        service_info = service.to_dict()
        people = []
        for one_person in service_info['user']:
            person = get_user_config_id_controller({'type':'person', 'id': one_person})
            people.append(person['name'])
        service_info['user'] = people
        address = get_user_config_id_controller({'type':'address', 'id': service_info['address']})
        service_info['address'] = ''+address['street']+' '+str(address['number'])+' '+address['city']
        client = get_user(service_info['client'])
        service_info['client_details'] = client.to_dict()
        if service_info['worker'] is not None and service_info['worker'] != '':
            worker = get_worker_controller_id({'email': service_info['worker']})
            service_info['worker_details'] = worker.json
        else:
            worker = None
            service_info['worker_details'] = worker
        response.append(service_info)
    return jsonify(response)


def get_service_controller_id(**params):
    service = get_service_id(params['id'])
    service_info = service.to_dict()
    people = []
    people_details = []
    for one_person in service_info['user']:
        person = get_user_config_id_controller({'type': 'person', 'id': one_person})
        people_details.append(person)
        people.append(person['name'])
    service_info['user'] = people
    service_info['user_details'] = people_details
    address = get_user_config_id_controller({'type': 'address', 'id': service_info['address']})
    service_info['address'] = '' + address['street'] + ' ' + str(address['number']) + ' ' + address['city']
    service_info['address_details'] = address
    client_details = get_user( service_info['client'])
    service_info['client_details'] = client_details.to_dict()
    if service_info['worker'] is not None and service_info['worker'] != '':
        worker = get_worker_controller_id({'email': service_info['worker']})
        service_info['worker_details'] = worker.json
    else:
        worker = None
        service_info['worker_details'] = worker
    return jsonify(service_info)


def post_service_controller(**params):
    service = create_new_service(params)
    return jsonify(service.to_dict())


def patch_service_controller(**params):
    service = update_service(params['id'], params['data'])
    if params['data']['status'] == 'accepted':
        update_worker('email', service.to_dict()['worker'], {'free': False})
    return jsonify(service.to_dict())
