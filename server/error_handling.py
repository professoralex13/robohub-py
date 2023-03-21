'''Custom error handlers'''
from werkzeug import exceptions
from flask import Flask


class UnknownJwtIdentity(exceptions.Unauthorized):
    '''Error handler for unknown JWT identity'''

    code = 401
    description = (
        'The provided JWT identity could not be attributed to any user'
    )


class MediaTypeMustBeJson(exceptions.UnsupportedMediaType):
    '''
        Error handler for incorrect media type
        Indicates that media type must be Json
    '''

    code = 415
    description = (
        'The provided media type was not Content/Json'
    )


class InvalidCredentials(exceptions.Unauthorized):
    '''
        Error handler for invaid username/password credentials
    '''

    code = 401
    description = (
        'Provided username/password credentials are invalid'
    )


class OrganisationNotFound(exceptions.NotFound):
    '''
        Error handler for not found organisation
    '''

    code = 404
    description = (
        'Provided organisation name could not be found in database'
    )


def handle_exception(exception: exceptions.HTTPException):
    '''Handler for managing all raised HTTPExceptions'''
    assert exception.description is not None
    assert exception.code is not None

    return {'error': exception.description}, exception.code


def register_handlers(app: Flask):
    '''Registers error handlers for the flask app'''
    app.register_error_handler(UnknownJwtIdentity, handle_exception)
