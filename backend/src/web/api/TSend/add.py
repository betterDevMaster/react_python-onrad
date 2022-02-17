from flask import request, session

from utils import log
from web.apihandler import apihandler
from database import sqlite

# ============== add Sender view ===============================================================
# path:   /TSend/add
# Method: POST


def add(api):
    error = 'Unknow error. Please contact to your administrator.'
    try:
        host = request.secure_arguments.get('host')
        port = request.secure_arguments.get('port')
        ae_title = request.secure_arguments.get('ae_title')
        active = request.secure_arguments.get('active')

        if host == None or port == None or ae_title == None or host == '' or port == '' or ae_title == '' or active == None:
            return {'error': 1, 'detail': 'Invalid parameters'}

        ret = sqlite.getInstance().execute("INSERT INTO sender (host, port, ae_title, active) VALUES('%s',%s,'%s',%s)" %
                                           (host, port, ae_title, active))

        if ret == True:
            return {'error': 0}
        return {'error': 1, 'detail': 'Host was duplicated.'}
    except Exception as e:
        error = str(e)
    return {'error': 1, 'detail': error}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['POST'],
        'api':      '/TSend/add',
        'guest':    False,         # this value will be true in only login api!
        'procedure': add,
        'timecheck': False
    }
)
