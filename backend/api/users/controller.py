import logging

from flask import jsonify

from api.auth import get_token_info, is_admin, is_user, is_worker, check_admin_user
from model.errors import ModelNotFound
from model.users import get_user, create_new_user, update_user, get_admins
from model.phones import create_new_phone, get_phones, delete_phone
from model.people import create_new_person, get_people, delete_person, get_people_id, update_person
from model.address import create_new_address, get_addresses, delete_address, get_address_id, update_address


def get_user_profile_controller(params):
    email = params['email']
    user = get_user(email)
    return jsonify(user.to_dict())


def post_user_config_controller(**params):
    if params['type'] == 'phone':
        phone = create_new_phone(params['phone'], params['email'])
        return jsonify(phone.to_dict())
    elif params['type'] == 'person':
        person = create_new_person(params['data'], params['email'])
        return jsonify(person.to_dict())
    elif params['type'] == 'address':
        person = create_new_address(params['data'], params['email'])
        return jsonify(person.to_dict())


def delete_user_config_controller(**params):
    if params['type'] == 'phone':
        deleted = delete_phone(params['id'])
        return jsonify(deleted)
    if params['type'] == 'person':
        deleted = delete_person(params['id'])
        return jsonify(deleted)
    if params['type'] == 'address':
        deleted = delete_address(params['id'])
        return jsonify(deleted)


def get_user_config_controller(**params):
    if params['type'] == 'phone':
        try:
            phones = get_phones(params['email'])
        except ModelNotFound:
            return jsonify([])
        response = []
        for phone in phones:
            phone_info = phone.to_dict()
            response.append(phone_info)
        return jsonify(response)
    elif params['type'] == 'person':
        try:
            people = get_people(params['email'])
        except ModelNotFound:
            return jsonify([])

        response = []
        for person in people:
            person_info = person.to_dict()
            response.append(person_info)
        return jsonify(response)
    elif params['type'] == 'address':
        try:
            addresses = get_addresses(params['email'])
        except ModelNotFound:
            return jsonify([])

        response = []
        for address in addresses:
            address_info = address.to_dict()
            response.append(address_info)
        return jsonify(response)


def get_user_config_id_controller(params):
    if params['type'] == 'person':
        person = get_people_id(params['id'])
        return person.to_dict()
    if params['type'] == 'address':
        address = get_address_id(params['id'])
        return address.to_dict()


def patch_user_config_controller(**params):
    if params['type'] == 'person':
        person = update_person(params['email'], params['data'])
        return jsonify(person.to_dict())
    if params['type'] == 'address':
        address = update_address(params['email'], params['data'])
        return jsonify(address.to_dict())


def patch_user_info_controller(**params):
    user = update_user(params['email'], **params['data'])
    return jsonify(user.to_dict())


def post_user_controller(**params):
    try:
        user = get_user(params['email'])
        if user.to_dict()['admin']:
            return jsonify(user.to_dict())
        else:
            update_user(user.to_dict()['email'], **{'admin': True})
    except ModelNotFound:
        user = create_new_user(params)
    return jsonify(user.to_dict())


def get_user_admin_controller(params):
    try:
        admins = get_admins()
    except ModelNotFound:
        return jsonify([])

    response = []
    for admin in admins:
        admin_info = admin.to_dict()
        response.append(admin_info)
    return jsonify(response)
