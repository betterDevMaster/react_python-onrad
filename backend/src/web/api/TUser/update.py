from flask import request, session
import hashlib

from utils import log
from web.apihandler import apihandler
from web.auth.users import User
from database import sqlite

# ============== log view ===============================================================
# path:   /TUser/update
# Method: POST
# Return: {error:integer, detail: string}


def update(api):
    try:
        userid = int(request.secure_arguments.get('userid'))
        if userid == None:
            return {'error': 1, 'detail': 'No user id was specified'}
        user = User.getUserById(userid)
        if user == None:
            return {'error': 1, 'detail': 'Invalid user id'}

        password = hashlib.md5(request.secure_arguments.get('password').encode()).hexadigest() if request.secure_arguments.get('password') != None else user.password
        email = request.secure_arguments.get('email') if request.secure_arguments.get('email') != None else user.email
        manager = request.secure_arguments.get('manager') if request.secure_arguments.get('manager') != None else user.manager
        type = request.secure_arguments.get('type') if request.secure_arguments.get('type') != None else user.type
        status = request.secure_arguments.get('status') if request.secure_arguments.get('status') != None else user.status
        backend = request.secure_arguments.get('backend') if request.secure_arguments.get('backend') != None else user.backend
        frontend = request.secure_arguments.get('frontend') if request.secure_arguments.get('frontend') != None else user.frontend

        ret = sqlite.getInstance().execute("UPDATE users SET passwd='%s',backend='%s',frontend='%s',email='%s',props=%s,status=%s,manager=%s WHERE id=%s;" % (
            password, backend, frontend, email, type, status, manager, userid
        ))
        if ret == True:
            User.reload()
            return {'error': 0, 'userid': userid}

    except Exception as e:
        pass
    return {'error': 1, 'detail': 'Invalid params'}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['PUT'],
        'api':      '/TUser/update',
        'guest':    False,         # this value will be true in only login api!
        'procedure': update,
        'timecheck': False
    }
)
