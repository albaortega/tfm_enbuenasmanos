from flask import jsonify
from model.errors import ModelNotFound
from model.prices import ids, get_prices, update_price
import logging





def get_prices_controller(params):
    try:
        prices = get_prices()
    except ModelNotFound:
        logging.info('No existen trabajadores')
        return jsonify([])

    response = []
    for price in prices:
        price_info = price.to_dict()
        response.append(price_info)
    return jsonify(response)


def patch_prices_controller(params):
    type = params['type']
    if type == 'kids':
        for key in ids.keys():
            id = ids[key]
            data = {'price_kids': params[key]}
            update_price(id, data)
    elif type == 'home':
        for key in ids.keys():
            id = ids[key]
            data = {'price_home': params[key]}
            update_price(id, data)
    elif type == 'hospital':
        for key in ids.keys():
            id = ids[key]
            data = {'price_hospital': params[key]}
            update_price(id, data)
    return {'result': 'OK'}

