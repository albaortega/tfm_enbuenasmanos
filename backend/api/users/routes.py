import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.users.controller import get_user_profile_controller, post_user_config_controller,\
get_user_config_controller, delete_user_config_controller, get_user_config_id_controller, patch_user_config_controller,\
    post_user_controller, patch_user_info_controller, get_user_admin_controller


user_blueprint = Blueprint(
    'users',
    __name__
)


@user_blueprint.route('', methods=['GET', 'PATCH', 'POST'])
def manage_user():
    logging.info('Se hace una petición %s al endpoint /api/user', request.method)

    if request.method == 'GET':
        return _manage_user_get()
    elif request.method == 'POST':
        return _manage_user_post()
    else:
        raise NotImplemented('Method not valid')


def _manage_user_get():
    return get_user_info_controller()


@user_blueprint.route('/info', methods=['GET','PATCH'])
def manage_user_info():
    logging.info('Se hace una petición %s al endpoint /api/user/info', request.method)

    if request.method == 'GET':
        return _manage_user_get_info()
    elif request.method == 'PATCH':
        return _manage_user_patch_info()
    else:
        raise NotImplemented('Method not valid')


def _manage_user_get_info():
    params = request.args
    return get_user_profile_controller(params)


@user_blueprint.route('/config', methods=['POST', 'GET', 'DELETE', 'PATCH'])
def manage_user_config():
    logging.info('Se hace una petición %s al endpoint /api/user/info/config', request.method)

    if request.method == 'POST':
        return _manage_user_post_config()
    if request.method == 'GET':
        return _manage_user_get_config()
    if request.method == 'DELETE':
        return _manage_user_delete_config()
    if request.method == 'PATCH':
        return _manage_user_patch_config()
    else:
        raise NotImplemented('Method not valid')


@user_blueprint.route('/config/id', methods=[ 'GET'])
def manage_user_config_id():
    logging.info('Se hace una petición %s al endpoint /api/user/info/config/id', request.method)

    if request.method == 'GET':
        return _manage_user_get_config_id()
    else:
        raise NotImplemented('Method not valid')


@user_blueprint.route('/admin', methods=['POST', 'GET', 'DELETE', 'PATCH'])
def manage_user_admin():
    logging.info('Se hace una petición %s al endpoint /api/user/admin', request.method)

    if request.method == 'POST':
        return _manage_user_post_config()
    if request.method == 'GET':
        return _manage_user_get_admin()
    if request.method == 'DELETE':
        return _manage_user_delete_config()
    if request.method == 'PATCH':
        return _manage_user_patch_config()
    else:
        raise NotImplemented('Method not valid')


def _manage_user_get_admin():
    params = request.args
    return get_user_admin_controller(params)

def _manage_user_get_config_id():
    params = request.args
    return get_user_config_id_controller(params)


def _manage_user_get_config():
    params = request.args
    return get_user_config_controller(**params)


def _manage_user_delete_config():
    params = request.args
    return delete_user_config_controller(**params)


def _manage_user_post_config():
    params = request.json
    return post_user_config_controller(**params)


def _manage_user_patch_config():
    params = request.json
    return patch_user_config_controller(**params)


def _manage_user_patch_info():
    params = request.json
    return patch_user_info_controller(**params)


def _manage_user_post():
    params = request.json
    return post_user_controller(**params)
