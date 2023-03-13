'''Database helper functions'''
from flask import g
from prisma import Prisma


def get_database() -> Prisma:
    '''Gets the global instance of the prisma database'''

    database = getattr(g, '_database', None)

    if database is None:
        database = g._database = Prisma()
        database.connect()

    return database
