from flask import Flask
from flask_cors import CORS

from environment import JWT_SECRET

from routes.auth import auth_router, jwt

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = JWT_SECRET

jwt.init_app(app)

EMAIL_KEY = 'email'
PASSWORD_KEY = 'password'

app.register_blueprint(auth_router, url_prefix="/auth")


if __name__ == '__main__':
    app.run(debug=True)
