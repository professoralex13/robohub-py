'''Profile route handlers'''
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.database import database

account_router = Blueprint('account', __name__)


@account_router.get("/profile")
@jwt_required()
def profile():
    '''Returns data about a users profile'''
    email = get_jwt_identity()
    user = database.user.find_first(where={'email': email})
    if user is None:
        return {"error": "jwt was associated with email which does not exist in the database "}, 400

    return jsonify({
        "username": user.username,
        "email": user.email,
        "fullName": user.fullName,
    })
