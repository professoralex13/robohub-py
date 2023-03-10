from flask import Blueprint, request, abort
from flask_jwt_extended import JWTManager, create_access_token

from config import EMAIL_KEY, PASSWORD_KEY

jwt = JWTManager()

auth_router = Blueprint("auth", __name__)

@auth_router.post('/token')
def get_token():
    if request.json is not None:
        email: str = request.json.get(EMAIL_KEY, None)
        password: str = request.json.get(PASSWORD_KEY, None)
    else:
        return abort(415, "Content type must be application/json")

    print('email, password ', email, password)

    if email != "test" or password != "test":
        return { "error": "Wrong email or password" }, 401
        
    access_token = create_access_token(identity=email)
    response = { "access_token": access_token }

    return response, 400
