'''Endpoints for content serving'''

import os

from flask import Blueprint
from server.config import USER_AVATAR_PATH


content_router = Blueprint('content', __name__)


@content_router.get('/avatar/users/<user_id>')
def user_avatar(user_id: str):
    '''Serves the avatar of a user'''
    try:
        path = os.path.join(USER_AVATAR_PATH, f'{user_id}.png')

        with open(path, 'rb') as file:
            return file.read(), 200, {'Content-Type': 'image/png'}
    except FileNotFoundError:
        return '', 404
