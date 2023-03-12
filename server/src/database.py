from flask import g
from prisma import Prisma

def get_database():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = Prisma()
        db.connect()
    return db