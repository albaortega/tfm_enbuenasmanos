import logging

from flask import request, Blueprint
from werkzeug.exceptions import NotImplemented
from api.prices.controller import get_prices_controller, patch_prices_controller


price_blueprint = Blueprint(
    'prices',
    __name__
)


@price_blueprint.route('', methods=['GET','PATCH'])
def manage_worker():
    logging.info('Se hace una petición %s al endpoint /api/prices', request.method)

    if request.method == 'GET':
        return _manage_prices_get()
    elif request.method == 'PATCH':
        return _manage_prices_patch()
    else:
        raise NotImplemented('Method not valid')


def _manage_prices_get():
    params = request.args
    return get_prices_controller(params)


def _manage_prices_patch():
    params = request.json
    return patch_prices_controller(params)
