from flask import Flask
from utils import *
FlaskApp = Flask(__name__, static_folder='../../static', static_url_path='')


@FlaskApp.route('/')
def index():
    return FlaskApp.send_static_file('index.html')


@FlaskApp.route('/<path:param1>/<path:param2>')
def other(param1, param2):
    if param1 == 'static' or param1 == 'fonts':
        return FlaskApp.send_static_file(param1 + '/' + param2)

    return FlaskApp.send_static_file('index.html')


# @FlaskApp.route('/<path:path>/<method:method>')
# def static_file(path):
#     print(path)
#     if path.startswith('static') or path.startswith('fonts') or path == 'app.css' or path == 'app.bundle.js':
#         return FlaskApp.send_static_file(path)
#     return FlaskApp.send_static_file('index.html')


log.info("Main", "=========================================================")
log.info("Main", " %s v%s (%s) is starting up. " % (setting.getsetting("NAME"), setting.getsetting("VERSION"), setting.getsetting("LAST_UPDATE")))
log.info("Main", "=========================================================")
