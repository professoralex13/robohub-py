from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(".env"))

def load_from_env(key: str) -> str:
    result = os.getenv("JWT_SECRET")

    if result is None:
        raise Exception(f"{key} could not be found in .env")

    return result

JWT_SECRET = load_from_env("JWT_SECRET")
EMAIL_KEY = 'email'
PASSWORD_KEY = 'password'
USERNAME_KEY = 'username'