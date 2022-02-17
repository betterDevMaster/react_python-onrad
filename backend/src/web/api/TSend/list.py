from flask import request, session

from utils import log
from web.apihandler import apihandler
from database import sqlite

# ============== list view ===============================================================
# path:   /TSend/list
# Method: POST
# Return: {error:integer, detail: string}


def list(api):
    error = 'Unknow error. Please contact to your administrator.'
    try:
        page_index = request.secure_arguments.get('page_index')
        page_size = request.secure_arguments.get('page_size')
        if page_index != None and page_size != None:
            ret = sqlite.getInstance().select("SELECT id,host,port,ae_title,active FROM sender ORDER BY id ASC LIMIT %d OFFSET %d;" % (int(page_size), int(page_index)*int(page_size)))
        else:
            ret = sqlite.getInstance().select("SELECT id,host,port,ae_title,active FROM sender ORDER BY id ASC;")
        sender_count = sqlite.getInstance().select("SELECT COUNT(id) FROM sender;")

        if ret != None:
            senders = []
            for rec in ret:
                senders.append({
                    'id': rec[0],
                    'host': rec[1],
                    'port': rec[2],
                    'ae_title': rec[3],
                    'active': rec[4],
                })
            return {'error': 0, 'list': senders, 'sender_count': sender_count[0][0]}
    except Exception as e:
        error = str(e)
    return {'error': 1, 'detail': error}


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['GET'],
        'api':      '/TSend/list',
        'guest':    False,         # this value will be true in only login api!
        'procedure': list,
        'timecheck': False
    }
)
