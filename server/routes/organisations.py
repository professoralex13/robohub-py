'''Router for handling organisation related requets'''
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required  # type: ignore
from server.database import database

organisations_router = Blueprint('organisations', __name__)


@organisations_router.get('/list')
@jwt_required()
def organisation_list():
    '''Fetches a list of organisations which the current user is a member of'''
    email = get_jwt_identity()
    user = database.user.find_first(where={'email': email})
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


@organisations_router.post('/create')
@jwt_required()
def create_organisation():
    '''
        Creates a new organisation with the provided form data
        And adds the current user to that organisation
    '''
    if request.json is not None:
        name: str = request.json.get('name', None)
        description: str = request.json.get('description', None)
        location: str = request.json.get('location', None)
    else:
        return {"error": "Content type must be application/json"}, 415

    email = get_jwt_identity()
    user = database.user.find_first(where={'email': email})
    if user is None:
        return {"error": "jwt was associated with email which does not exist in the database "}, 401

    new_organisation = database.organisation.create(data={
        'name': name,
        'description': description,
        'location': location,
    })

    database.organisationuser.create(data={
        'userId': user.id,
        'organisationId': new_organisation.id,
        'isAdmin': True,
    })

    return jsonify({"msg": "success"})


@organisations_router.get("/name-taken/<name>")
def email_taken(name: str):
    '''Handles a request to see whether a given organisation name is taken'''

    in_use = database.organisation.find_first(where={
        'name': name,
    })

    return jsonify(in_use is not None)
