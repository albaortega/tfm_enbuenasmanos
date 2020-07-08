import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.workers.controller import get_worker_controller, post_worker_controller, patch_worker_controller, \
    get_worker_controller_id


worker_blueprint = Blueprint(
    'workers',
    __name__
)


@worker_blueprint.route('', methods=['GET', 'POST', 'PATCH'])
def manage_worker():
    logging.info('Se hace una petición %s al endpoint /api/worker', request.method)

    if request.method == 'GET':
        return _manage_worker_get()
    if request.method == 'POST':
        return _manage_worker_post()
    if request.method == 'PATCH':
        return _manage_worker_patch()
    else:
        raise NotImplemented('Method not valid')


@worker_blueprint.route('/id', methods=['GET'])
def manage_worker_id():
    logging.info('Se hace una petición %s al endpoint /api/service/id', request.method)

    if request.method == 'GET':
        return _manage_worker_get_id()
    else:
        raise NotImplemented('Method not valid')


def _manage_worker_get():
    params = request.args
    return get_worker_controller(params)


def _manage_worker_post():
    params = request.json
    return post_worker_controller(**params)


def _manage_worker_patch():
    params = request.json['params']
    return patch_worker_controller(**params)


def _manage_worker_get_id():
    params = request.args
    return get_worker_controller_id(params)
