'''Database helper functions'''
from prisma import Prisma

database = Prisma()
database.connect()
