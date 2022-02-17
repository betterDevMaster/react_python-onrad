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


def list(api):
    error = 'Unknow error. Please contact to your administrator.'
    try:
        page_index = request.secure_arguments.get('page_index')
        page_size = request.secure_arguments.get('page_size')
        if page_index != None and page_size != None:
            ret = sqlite.getInstance().select("SELECT id,name,backend,frontend,email,props,status,manager FROM users ORDER BY id ASC LIMIT %d OFFSET %d;" % (int(page_size), int(page_index)*int(page_size)))
        else:
            ret = sqlite.getInstance().select("SELECT id,name,backend,frontend,email,props,status,manager FROM users ORDER BY id ASC;")
        user_account = sqlite.getInstance().select("SELECT COUNT(id) FROM users;")

        if ret != None:
            users = []
            for rec in ret:
                users.append({
                    'id': rec[0],
                    'name': rec[1],
                    'backend': rec[2],
                    'frontend': rec[3],
                    'email': rec[4],
                    'type': rec[5],
                    'status': rec[6],
                    'manager': rec[7],
                })
            return {'error': 0, 'users': users, 'users_count': user_account[0][0]}
    except Exception as e:
        error = str(e)
    return {'error': 1, 'detail': error}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['GET'],
        'api':      '/TUser/list',
        'guest':    False,         # this value will be true in only login api!
        'procedure': list,
        'timecheck': False
    }
)
