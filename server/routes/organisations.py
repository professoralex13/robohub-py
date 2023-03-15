from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.database import database

organisations_router = Blueprint('organisations', __name__)


@organisations_router.get('/list')
@jwt_required()
def organisation_list():
    email = get_jwt_identity()
    user = database.user.find_first(
        where={'email': email}, include={'organisations': {
            'include': {
                'organisation': True
            }
        }})
    if user is None:
        return {"error": "jwt was associated with email which does not exist in the database "}, 401

    organisations = database.organisation.find_many(where={
        'users': {
            'some': {
                'userId': user.id
            }
        }
    })

    return jsonify([organisation.name for organisation in organisations])
