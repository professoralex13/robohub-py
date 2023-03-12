from datetime import datetime, timezone, timedelta
import json
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies

from config import EMAIL_KEY, PASSWORD_KEY

jwt = JWTManager()

auth_router = Blueprint("auth", __name__)

@auth_router.post('/token')
def get_token():
    if request.json is not None:
        email: str = request.json.get(EMAIL_KEY, None)
        password: str = request.json.get(PASSWORD_KEY, None)
    else:
        return { "error": "Content type must be application/json" }, 415
 
    if email != "test" or password != "test":
        return { "error": "Wrong email or password" }, 401
        
    access_token = create_access_token(identity=email)
    response = { "token": access_token }

    return response

@auth_router.post("/logout")
def logout():
    response = jsonify({ "status": "logout sucessful" })
    unset_jwt_cookies(response)
    return response

def refresh_expiring_jwts(response: Response):
    try:
        expiry_timestamp: float = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

        if target_timestamp > expiry_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            
            if type(data) is dict:
                data["token"] = access_token 
                response.data = json.dumps(data)

        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response