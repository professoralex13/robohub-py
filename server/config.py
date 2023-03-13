'''Handles loading of environment variables and constants'''
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(".env"))


class MissingEnvironmentVariable(Exception):
    '''
        Exception for missing environment variable configuration
    '''

    def __init__(self, variable_name: str) -> None:
        super().__init__(f"{variable_name} could not be found in .env")


def load_from_env(key: str) -> str:
    '''
        Loads a variable from the .env file
        Raises an exception if it has not been defined
    '''
    result = os.getenv("JWT_SECRET")

    if result is None:
        raise MissingEnvironmentVariable(key)

    return result


JWT_SECRET = load_from_env("JWT_SECRET")
EMAIL_KEY = 'email'
PASSWORD_KEY = 'password'
USERNAME_KEY = 'username'
