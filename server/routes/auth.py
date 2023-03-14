'''Authentication route handlers'''
from datetime import datetime, timezone, timedelta
import json
import hashlib
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import (
    JWTManager,
    create_access_token,  # type: ignore
    get_jwt,  # type: ignore
    get_jwt_identity,
    unset_jwt_cookies,
)

from server.database import database

from server.config import SALT, EMAIL_KEY, PASSWORD_KEY, USERNAME_KEY

jwt = JWTManager()

auth_router = Blueprint("auth", __name__)


@auth_router.post('/sign-up')
def sign_up():
    '''Handles a request to sign-up a new user'''

    if request.json is not None:
        email: str = request.json.get(EMAIL_KEY, None)
        username: str = request.json.get(USERNAME_KEY, None)
        password: str = request.json.get(PASSWORD_KEY, None)
    else:
        return {"error": "Content type must be application/json"}, 415

    salted_password = hashlib.md5((password + SALT).encode()).hexdigest()

    database.user.create(data={
        "email": email,
        "username": username,
        "passwordHash": salted_password,
    })

    access_token = create_access_token(identity=email)
    response = {"token": access_token, "oogabogga": "hehe"}

    return response


@auth_router.post('/token')
def get_token():
    '''Handles a request for a user to login by generating a new jwt'''

    if request.json is not None:
        email: str = request.json.get(EMAIL_KEY, None)
        password: str = request.json.get(PASSWORD_KEY, None)
    else:
        return {"error": "Content type must be application/json"}, 415

    user = database.user.find_first(where={
        'email': email,
    })

    salted_password = hashlib.md5((password + SALT).encode()).hexdigest()

    if user is None or user.passwordHash != salted_password:
        return {"error": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"token": access_token}

    return response


@auth_router.post("/logout")
def logout():
    '''Handles a request to logout the user by clearing jwt cookies'''

    response = jsonify({"status": "logout sucessful"})
    unset_jwt_cookies(response)
    return response


@auth_router.get("/email-taken/<email>")
def email_taken(email: str):
    '''Handles a request to see whether a given email is taken by another user'''

    in_use = database.user.find_first(where={
        'email': email,
    })
    return jsonify(in_use is not None)


@auth_router.get("/username-taken/<username>")
def username_taken(username: str):
    '''Handles a request to see whether a given username is taken by another user'''

    in_use = database.user.find_first(where={
        'username': username,
    })

    return jsonify(in_use is not None)


def refresh_expiring_jwts(response: Response):
    '''Refreshes bearer tokens which are half way to expiring'''
    try:
        expiry_timestamp: float = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

        if target_timestamp > expiry_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()

            if isinstance(data, dict):
                data["token"] = access_token
                response.data = json.dumps(data)

        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
