'''Team related routes'''

from flask import Blueprint, jsonify
from server.database import database

teams_router = Blueprint('teams', __name__)


@teams_router.get('/id-taken/<team_id>')
def id_taken(team_id: str):
    '''Checks if a team id is taken'''
    team = database.team.find_first(where={'id': team_id})

    return jsonify(team is not None)
