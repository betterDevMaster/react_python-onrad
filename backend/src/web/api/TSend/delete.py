from flask import request, session

from utils import log
from web.apihandler import apihandler
from database import sqlite

# ============== Delete S3 view ===============================================================
# path:   /TS3/delete
# Method: DELETE


def delete(api):
    error = 'Unknow error. Please contact to your administrator.'
    try:
        id = request.secure_arguments.get('id')
        if id == None:
            return {'error': 1, 'detail': 'Invalid parameters'}

        ret = sqlite.getInstance().execute("DELETE FROM sender WHERE id=%s" % id)

        if ret == True:
            return {'error': 0}
    except Exception as e:
        error = str(e)
    return {'error': 1, 'detail': error}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['DELETE'],
        'api':      '/TSend/delete',
        'guest':    False,         # this value will be true in only login api!
        'procedure': delete,
        'timecheck': False
    }
)
