from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(dotenv_path=Path(".env"))

JWT_SECRET = os.getenv("JWT_SECRET")
