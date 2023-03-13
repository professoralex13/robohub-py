'''Root of robohub backend'''
from datetime import timedelta
from flask import Flask, Response, g
from flask_cors import CORS
from routes.auth import auth_router, jwt, refresh_expiring_jwts
from .config import JWT_SECRET


app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = JWT_SECRET
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt.init_app(app)

app.register_blueprint(auth_router, url_prefix="/auth")


@app.after_request
def after_request(response: Response):
    '''Runs after any request to the backend API'''

    return refresh_expiring_jwts(response)


@app.teardown_appcontext
def close_database_connection(_):
    '''Closes database connection when server is shutdown'''
    database = getattr(g, '_database', None)

    if database is not None:
        database.disconnect()


if __name__ == '__main__':
    app.run(debug=True)
