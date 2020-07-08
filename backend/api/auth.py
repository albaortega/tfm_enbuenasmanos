import logging
import os

from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError, \
    CertificateFetchError
from flask import request
from werkzeug.exceptions import Unauthorized, Forbidden, BadRequest, NotFound

from model.errors import ModelNotFound
from model.users import get_user


def get_token_info():
    """
    Decodifica la información contenida en el token y recibida en la cabecera 'Authorization'.
    :return: Token JWT decodificado.
    """

    auth_header = request.headers.get('Authorization')

    if not auth_header:
        logging.warning('No se recibe la cabecera \'Authorization\'.')
        raise Unauthorized('loginRequired')

    # Se recoge la información propia del token.
    splitted_auth_header = auth_header.split(' ')

    if len(splitted_auth_header) != 2 or splitted_auth_header[0] != 'Bearer':
        logging.warning('El tipo de cabecera \'Authorization\' no es válido.')
        raise Unauthorized('tokenTypeNotSupported')

    token = splitted_auth_header[1]

    try:
        logging.info('Se intenta decodificar el token de usuario.')
        return auth.verify_id_token(token)
    except ExpiredIdTokenError as err:
        logging.warning(err)
        raise Unauthorized('tokenExpired')
    except RevokedIdTokenError as err:
        logging.warning(err)
        raise Unauthorized('userTokenHasBeenRevoked')
    except (ValueError, InvalidIdTokenError, CertificateFetchError) as err:
        logging.warning(err)
        raise Unauthorized('tokenTypeNotSupported')


def check_admin_user():
    token_info = get_token_info()
    email = token_info['email']

    try:
        user = get_user(email)
    except ModelNotFound:
        raise Unauthorized('notAuthorized')

    if not user.admin:
        raise Unauthorized('notAuthorized')


def check_catering_user():
    token_info = get_token_info()
    email = token_info['email']

    try:
        user = get_user(email)
    except ModelNotFound:
        raise Unauthorized('notAuthorized')

    if not user.catering:
        raise Unauthorized('notAuthorized')


def is_admin(email):
    try:
        user = get_user(email)
        return user.admin
    except ModelNotFound:
        raise NotFound('userNotFound')


def is_user(email):
    try:
        user = get_user(email)
        return user.user
    except ModelNotFound:
        raise NotFound('userNotFound')


def is_worker(email):
    try:
        user = get_user(email)
        return user.worker
    except ModelNotFound:
        raise NotFound('userNotFound')


def validate_str_param(param_name, params, required=False, allowed_values=None, allowed_empty=False, nullable=False):
    """
    Se valida un campo de tipo string.
    :return:
    """

    # Se comprueba si el parámetro existe cuando es requerido.
    if required and param_name not in params.keys():
        raise BadRequest('notValidParameters')

    # Si no es requerido y no existe, no se hacen más comprobaciones.
    if not required and param_name not in params.keys():
        return

    # Si se permite vacío y viene vacío, no se hacen más comprobaciones.
    if allowed_empty and not params[param_name]:
        return

    # Si se puede null, se comprueba.
    if nullable and params[param_name] is None:
        return

    # Se comprueba el tipo.
    if not isinstance(params[param_name], str):
        raise BadRequest('notValidParameters')

    # Si los valores de cada elemento tienen que estar en un listado de valores permitidos, se comprueban.
    if allowed_values and params[param_name] not in allowed_values:
        raise BadRequest('notValidParameters')


def validate_int_param(param_name, params, required=False, allowed_values=None, min_value=None, max_value=None, nullable=False):
    """
    Se valida un campo de tipo int.
    :return:
    """

    # Se comprueba si el parámetro existe cuando es requerido.
    if required and param_name not in params.keys():
        raise BadRequest('notValidParameters')

    # Si no es requerido y no existe, no se hacen más comprobaciones.
    if not required and param_name not in params.keys():
        return

    # Si se puede null, se comprueba.
    if nullable and params[param_name] is None:
        return

    # Se comprueba el tipo.
    if not isinstance(params[param_name], int):
        raise BadRequest('notValidParameters')

    # Si los valores de cada elemento tienen que estar en un listado de valores permitidos, se comprueban.
    if allowed_values and params[param_name] not in allowed_values:
        raise BadRequest('notValidParameters')

    # Se comprueba el máximo y el mínimo.
    if min_value and params[param_name] < min_value:
        raise BadRequest('notValidParameters')

    # Se comprueba el máximo y el máximo.
    if max_value and params[param_name] > max_value:
        raise BadRequest('notValidParameters')


def validate_bool_param(param_name, params, required=False):
    """
    Se valida un campo de tipo int.
    :return:
    """

    # Se comprueba si el parámetro existe cuando es requerido.
    if required and param_name not in params.keys():
        raise BadRequest('notValidParameters')

    # Si no es requerido y no existe, no se hacen más comprobaciones.
    if not required and param_name not in params.keys():
        return

    # Se comprueba el tipo.
    if not isinstance(params[param_name], bool):
        raise BadRequest('notValidParameters')


def validate_list_param(param_name, params, required=False, check_length=0, allowed_values=None, check_str=False,
                        check_int=False):
    # Se comprueba si el parámetro existe cuando es requerido.
    if required and param_name not in params.keys():
        raise BadRequest('notValidParameters')

    # Si no es requerido y no existe, no se hacen más comprobaciones.
    if not required and param_name not in params.keys():
        return

    # Se comprueba que es de tipo lista y no está vacío.
    if not isinstance(params[param_name], list):
        raise BadRequest('notValidParameters')

    # Se comprueba la longitud
    if check_length and len(params[param_name]) != check_length:
        raise BadRequest('notValidParameters')

    # Si los valores de cada elemento tienen que estar en un listado de valores permitidos, se comprueban.
    if allowed_values:
        for value in params[param_name]:
            if value not in allowed_values:
                raise BadRequest('notValidParameters')

    # Si hay que comprobar si los valores son strings, se comprueba.
    if check_str:
        for value in params[param_name]:
            if not isinstance(value, str):
                raise BadRequest('notValidParameters')

    # Si hay que comprobar si los valores son enteros, se comprueba.
    if check_int:
        for value in params[param_name]:
            if not isinstance(value, int):
                raise BadRequest('notValidParameters')


def check_cron_task():
    cron_header = request.headers.get('X-Appengine-Cron')
    logging.info('La cabecera "X-Appengine-Cron" tiene valor "%s".', cron_header)

    if not cron_header or cron_header != 'true':
        logging.warning('No se recibe la cabecera "X-Appengine-Cron".')
        raise Unauthorized('loginRequired')
