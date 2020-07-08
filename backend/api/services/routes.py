import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.services.controller import get_service_controller, post_service_controller, patch_service_controller, get_service_controller_id


service_blueprint = Blueprint(
    'services',
    __name__
)


@service_blueprint.route('', methods=['GET', 'POST', 'PATCH'])
def manage_service():
    logging.info('Se hace una petición %s al endpoint /api/service', request.method)

    if request.method == 'GET':
        return _manage_service_get()
    if request.method == 'POST':
        return _manage_service_post()
    if request.method == 'PATCH':
        return _manage_service_patch()
    else:
        raise NotImplemented('Method not valid')


@service_blueprint.route('/id', methods=['GET'])
def manage_service_id():
    logging.info('Se hace una petición %s al endpoint /api/service/id', request.method)

    if request.method == 'GET':
        return _manage_service_get_id()
    else:
        raise NotImplemented('Method not valid')


def _manage_service_get():
    params = request.args
    return get_service_controller(**params)


def _manage_service_post():
    params = request.json
    return post_service_controller(**params)


def _manage_service_patch():
    params = request.json
    return patch_service_controller(**params)


def _manage_service_get_id():
    params = request.args
    return get_service_controller_id(**params)
