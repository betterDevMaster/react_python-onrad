from flask import request, session

from utils import log
from web.apihandler import apihandler
from web.auth.users import User
from database import sqlite
from web.auth.crypt import crypt

# ============== log view ===============================================================
# path:   /TUser/login
# Method: POST
# Params: { username, password }
# Return: {success:boolean, data: None}


def login(api):
    username = request.secure_arguments.get('user')
    password = request.secure_arguments.get('password')
    user = User.getValidUserBy(username, password)
    if user != None:
        if user.status == 0:
            user.login()
            token = session.get('userid')
            token = ''.join(format(x, '02x') for x in token)
            return {'error': 0, 'userid': user.id, 'name': user.name, 'type': user.type, 'loginStatus': 0, 'lastAccess': user.lastAccess, 'manager': user.manager, 'sessionToken': token}
        else:
            return {'error': 1, 'userid': user.id, 'name': user.name, 'type': user.type, 'loginStatus': user.status, 'lastAccess': user.lastAccess, 'manager': user.manager, 'sessionToken': ''}
    return {'error': 1, 'detail': 'Invalid user name or password'}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['POST'],
        'api':      '/TUser/login',
        'guest':    True,         # this value will be true in only login api!
        'procedure': login,
        'timecheck': False
    }
)
