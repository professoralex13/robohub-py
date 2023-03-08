from flask import Blueprint, request
from flask_jwt_extended import JWTManager

from server.main import EMAIL_KEY, PASSWORD_KEY

jwt = JWTManager()

auth_router = Blueprint("auth", __name__)


@auth_router.post('/token')
def get_token():
    email: str = request.json.get(EMAIL_KEY, None)
    password: str = request.json.get(PASSWORD_KEY, None)

    print('email, password ', email, password)

    password_hash = db_session.query(User.password_hash).where(
        User.email == email).first()

    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}

    return response
