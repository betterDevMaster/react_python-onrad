from flask import request, session

from utils import log
from web.apihandler import apihandler
from database import sqlite

# ============== update Send view ===============================================================
# path:   /TSend/update
# Method: PUT


def update(api):
    error = 'Unknow error. Please contact to your administrator.'
    try:
        id = request.secure_arguments.get('id')
        if id == None:
            return {'error': 1, 'detail': 'Invalid parameter'}

        ret = sqlite.getInstance().select('SELECT id, host, port, ae_title, active FROM sender WHERE id=%s;' % id)
        if ret != None:
            host = request.secure_arguments.get('host') if request.secure_arguments.get('host') != None else ret[0][1]
            port = request.secure_arguments.get('port') if request.secure_arguments.get('port') != None else ret[0][2]
            ae_title = request.secure_arguments.get('ae_title') if request.secure_arguments.get('ae_title') != None else ret[0][3]
            active = request.secure_arguments.get('active') if request.secure_arguments.get('active') != None else ret[0][4]

            ret = sqlite.getInstance().execute("UPDATE sender SET host='%s', port=%s, ae_title='%s', active=%s WHERE id=%s" %
                                               (host, port, ae_title, active, id))

            if ret == True:
                return {'error': 0}
            return {'error': 1, 'detail': 'Host was duplicated.'}

    except Exception as e:
        error = str(e)

    return {'error': 1, 'detail': error}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['PUT'],
        'api':      '/TSend/update',
        'guest':    False,         # this value will be true in only login api!
        'procedure': update,
        'timecheck': False
    }
)
