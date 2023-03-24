'''Profile route handlers'''
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore

from server.database import database
from server.error_handling import UnknownJwtIdentity

account_router = Blueprint('account', __name__)


@account_router.get('/profile')
@jwt_required()
def profile():
    '''Returns data about a users profile'''
    email = get_jwt_identity()
    user = database.user.find_first(where={'email': email})
    if user is None:
        raise UnknownJwtIdentity()

    return jsonify({
        'username': user.username,
        'email': user.email,
        'fullName': user.fullName,
    })


@account_router.get('/find/<query>')
def find(query: str):
    '''Finds a list of users whose email, username, or full name matches the query'''

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
        'username': user.username,
        'email': user.email,
        'fullName': user.fullName,
    } for user in users])
