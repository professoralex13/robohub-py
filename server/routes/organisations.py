'''Router for handling organisation related requets'''
from enum import Enum
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required  # type: ignore
from prisma.models import Organisation
from server.database import database
from server.error_handling import (MediaTypeMustBeJson,
                                   OrganisationNotFound,
                                   UserNotAuthorised,
                                   UserNotFound,
                                   )

from server.routes.auth import get_compulsory_user, get_current_user

organisations_router = Blueprint('organisations', __name__)


class MembershipType(int, Enum):
    '''
        Represents a users membership type in an organisation
        None means a user is not part of an organisation
    '''
    NONE = 0
    MEMBER = 1
    ADMIN = 2


def get_organisation(
        organisation_name: str,
        minimum_membership: MembershipType = MembershipType.MEMBER
        ) -> tuple[Organisation, MembershipType]:
    '''
        Gets an organisation by its name from database and
        checks if the current user fits the minimum membership,
        else raise UserNotAuthorised
    '''

    organisation = database.organisation.find_first(where={
        'name': organisation_name,
    }, include={'users': {'include': {'user': True}}})

    if organisation is None:
        raise OrganisationNotFound()

    assert organisation.users is not None

    logged_in_user = get_current_user(minimum_membership > MembershipType.NONE)

    membership_type: MembershipType = MembershipType.NONE

    if logged_in_user is not None:
        for membership in organisation.users:
            assert membership.user is not None

            if membership.user.id == logged_in_user.id:
                membership_type = MembershipType.MEMBER

                if membership.isAdmin:
                    membership_type = MembershipType.ADMIN

    if membership_type < minimum_membership:
        raise UserNotAuthorised()

    return (organisation, membership_type)


@organisations_router.get('/list')
@jwt_required()
def organisation_list():
    '''Fetches a list of organisations which the current user is a member of'''
    user = get_compulsory_user()

    organisations = database.organisation.find_many(where={
        'users': {
            'some': {
                'userId': user.id,
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
        raise MediaTypeMustBeJson()

    user = get_compulsory_user()

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

    return jsonify({'msg': 'success'})


@organisations_router.get('/<organisation_name>/meta')
@jwt_required()
def organisation_meta(organisation_name: str):
    '''
        Gets public metadata about a given organisation
    '''
    organisation, membership_type = get_organisation(organisation_name)

    member_count = database.organisationuser.count(where={
        'organisationId': organisation.id,
    })

    team_count = database.team.count(where={
        'organisationId': organisation.id,
    })

    return jsonify({
        'name': organisation.name,
        'description': organisation.description,
        'location': organisation.location,
        'memberCount': member_count,
        'teamCount': team_count,
        'membershipType': membership_type,
    })


@organisations_router.get('/<organisation_name>/members')
@jwt_required()
def organisation_member_list(organisation_name: str):
    '''
        Gets the list of members for a given organisation
    '''

    organisation, _ = get_organisation(organisation_name)

    organisation_user = database.organisationuser.find_many(
        where={'organisationId': organisation.id},
        include={
            'user': {
                'include': {
                    'teams': {
                        'include': {
                            'team': True
                        },
                        'where': {
                            'team': {
                                'is': {
                                    'organisationId': organisation.id
                                }
                            }
                        }
                    }
                }
            }
        })

    return [{
        'username': user.user.username,
        'fullName': user.user.fullName,
        'teams': [team.team.id for team in user.user.teams
                  if team.team is not None],
        'isAdmin': user.isAdmin
        } for user in organisation_user
        if user.user is not None and user.user.teams is not None]


@organisations_router.post('/<organisation_name>/members/add/<username>')
@jwt_required()
def add_member(organisation_name: str, username: str):
    '''
        Adds a member to the given organisation
        Ensures that current user is admin of that organisation
    '''
    user_to_add = database.user.find_first(where={'username': username})

    if user_to_add is None:
        raise UserNotFound()

    organisation, _ = get_organisation(organisation_name, MembershipType.ADMIN)

    database.organisationuser.create(data={
        'userId': user_to_add.id,
        'organisationId': organisation.id,
        'isAdmin': False})

    return organisation_member_list(organisation_name)


@organisations_router.post('/<organisation_name>/members/remove/<username>')
@jwt_required()
def remove_member(organisation_name: str, username: str):
    '''
        Removes a member from the given organisation
        Ensures that current user is admin of that organisation
    '''
    user_to_remove = database.user.find_first(where={'username': username})

    if user_to_remove is None:
        raise UserNotFound()

    organisation, _ = get_organisation(organisation_name, MembershipType.ADMIN)

    database.organisationuser.delete(where={
        'userId_organisationId': {
            'userId': user_to_remove.id,
            'organisationId': organisation.id,
        }
    })

    return organisation_member_list(organisation_name)


@organisations_router.get('/name-taken/<name>')
def name_taken(name: str):
    '''Handles a request to see whether a given organisation name is taken'''

    in_use = database.organisation.find_first(where={
        'name': name,
    })

    return jsonify(in_use is not None)
