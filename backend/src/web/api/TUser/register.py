from flask import request, session

from utils import log
from web.apihandler import apihandler
from web.auth.users import User
from database import sqlite
from web.auth.crypt import crypt

# ============== log view ===============================================================
# path:   /TUser/register
# Method: POST
# Return: {error:integer, detail: string}


def register(api):
    username = request.secure_arguments.get('user')
    password = request.secure_arguments.get('password')
    if username == None or password == None:
        return {'error': 1, 'detail': 'User name or password can not be null.'}

    email = request.secure_arguments.get('email') if request.secure_arguments.get('email') != None else ""
    manager = request.secure_arguments.get('manager') if request.secure_arguments.get('manager') != None else 0
    type = request.secure_arguments.get('type') if request.secure_arguments.get('type') != None else 0
    backend = request.secure_arguments.get('backend') if request.secure_arguments.get('backend') != None else "*"
    frontend = request.secure_arguments.get('frontend') if request.secure_arguments.get('frontend') != None else "*"

    ret = sqlite.getInstance().execute("INSERT INTO users (name,passwd,backend,frontend,email,props,status,manager) VALUES ('%s',md5('%s'),'%s','%s','%s',%s,%s,%s);" % (
        username, password, backend, frontend, email, type, 2, manager
    ))
    ret1 = sqlite.getInstance().select("SELECT id FROM users WHERE name='%s';" % username)
    if ret == True:
        User.reload()
        return {'error': 0, 'userid': ret1[0][0]}
    return {'error': 1, 'detail': 'Duplicated user name.'}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['POST'],
        'api':      '/TUser/register',
        'guest':    False,         # this value will be true in only login api!
        'procedure': register,
        'timecheck': False
    }
)
