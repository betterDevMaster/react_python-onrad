from flask import request, session
import os

from web.apihandler import apihandler
from dicom import scu

# ============== scp api ===============================================================
# path:   /TSend/start
# Method: POST


def start(api):
    try:
        scu.getInstance().start()
        return {
            'error': 0, 'status': True
        }
    except Exception as ex:
        return {
            'error': 1, 'status': True, 'detail': str(ex)
        }


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['POST'],
        'api':      '/TSend/start',
        'guest':    False,         # this value will be true in only login api!
        'procedure': start,
        'timecheck': False
    }
)

# ============== scp api ===============================================================
# path:   /TSend/stop
# Method: POST
# Return: {error:integer, detail?: string}


def stop(api):
    try:
        scu.getInstance().stop()
        return {
            'error': 0, 'status': False
        }
    except Exception as ex:
        return {
            'error': 1, 'status': False, 'detail': str(ex)
        }


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['POST'],
        'api':      '/TSend/stop',
        'guest':    False,         # this value will be true in only login api!
        'procedure': stop,
        'timecheck': False
    }
)

# ============== scp api ===============================================================
# path:   /TSend/status
# Method: GET
# Return: {error:integer, detail?: string}


def status(api):
    try:
        return {
            'error': 0,
            'status': scu.getInstance().status()
        }
    except Exception as ex:
        return {
            'error': 1,
            'detail': str(ex)
        }


# ---------------------------------------------------------------
apihandler(
    {
        'methods':  ['GET'],
        'api':      '/TSend/status',
        'guest':    False,         # this value will be true in only login api!
        'procedure': status,
        'timecheck': False
    }
)
