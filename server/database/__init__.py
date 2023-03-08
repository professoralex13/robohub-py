from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///server\database.db")

db_session = sessionmaker(bind=engine)()
