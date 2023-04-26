'''Profile route handlers'''
import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required  # type: ignore

from server.config import USER_AVATAR_PATH

from server.database import database
from server.routes.auth import get_compulsory_user


account_router = Blueprint('account', __name__)


@account_router.get('/profile')
@jwt_required()
def profile():
    '''Returns data about the current users profile'''
    user = get_compulsory_user()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'fullName': user.fullName,
    })


@account_router.post('/profile/avatar')
@jwt_required()
def set_avatar():
    '''Sets the avatar of the current user'''
    user = get_compulsory_user()

    file = request.files['avatar']

    file.save(os.path.join(USER_AVATAR_PATH, f'{user.id}.png'))  # type: ignore

    return {'msg': 'success'}


@account_router.get('/find/<query>')
def find(query: str):
    '''
        Finds a list of users whose email, username,
        or full name matches the query
    '''

    users = database.user.find_many(where={'OR': [{
            'email': {
                'contains': query,
            }
        }, {
            'fullName': {
                'contains': query,
            }
        }, {
            'username': {
                'contains': query,
            }
        }
    ]})

    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'fullName': user.fullName,
    } for user in users])
