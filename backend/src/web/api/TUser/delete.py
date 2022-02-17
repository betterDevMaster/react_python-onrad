from flask import request, session
import hashlib

from utils import log
from web.apihandler import apihandler
from web.auth.users import User
from database import sqlite

# ============== log view ===============================================================
# path:   /TUser/delete
# Method: DELETE
# Return: {error:integer, detail: string}


def delete(api):
    userid = int(request.secure_arguments.get('userid'))
    if userid == None:
        return {'error': 1, 'detail': 'No user id was specified'}
    user = User.getUserById(userid)
    if user == None:
        return {'error': 1, 'detail': 'Invalid user id'}

    ret = sqlite.getInstance().execute("DELETE FROM users WHERE id=%s;" % userid)
    if ret == True:
        User.reload()
        return {'error': 0, 'userid': userid}
    return {'error': 1, 'detail': 'Unknown error. Please contact to your administrator.'}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['DELETE'],
        'api':      '/TUser/delete',
        'guest':    False,         # this value will be true in only login api!
        'procedure': delete,
        'timecheck': False
    }
)
