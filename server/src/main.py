from flask import Flask  # pyright: reportImportCycles=false
from flask_cors import CORS
from config import JWT_SECRET
from routes.auth import auth_router, jwt

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = JWT_SECRET

jwt.init_app(app)

app.register_blueprint(auth_router, url_prefix="/auth")

if __name__ == '__main__':
    app.run(debug=True)
