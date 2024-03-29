'''Root of robohub backend'''
from datetime import timedelta
from flask import Flask, Response
from flask_cors import CORS
from server.routes.auth import auth_router, jwt, refresh_expiring_jwts
from server.routes.account import account_router
from server.routes.content import content_router
from server.routes.organisations import organisations_router
from server.routes.teams import teams_router
from server.config import JWT_SECRET
from server.error_handling import register_handlers


app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = JWT_SECRET
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt.init_app(app)

app.register_blueprint(auth_router, url_prefix='/auth')
app.register_blueprint(account_router, url_prefix='/account')
app.register_blueprint(organisations_router, url_prefix='/organisations')
app.register_blueprint(content_router, url_prefix='/content')
app.register_blueprint(teams_router, url_prefix='/teams')

register_handlers(app)


@app.after_request
def after_request(response: Response):
    '''Runs after any request to the backend API'''

    return refresh_expiring_jwts(response)


if __name__ == '__main__':
    app.run(debug=True)
