from flask import Flask, request, session
from flask_cors import CORS
from waitress import serve
import threading
import datetime
import os

from web import FlaskApp
from utils import log, setting
import web.api
from web.auth.keymaker import keymaker

# definition for flask app
_flask_class = None


class flask_server:
    @staticmethod
    def getInstance():
        global _flask_class
        if _flask_class == None:
            _flask_class = flask_server()
        return _flask_class

    def __init__(self):
        self.settings = setting.getsetting('FLASK')
        self.isDebug = setting.getsetting('DEBUG')
        self.port = self.settings.get('PORT')
        self.host = self.settings.get('HOST')
        self.secret = self.settings.get('SECRET')
        keymaker.readKey()

    # create and enavle cors
    def start(self):
        # create flask app
        log.info('Flask', 'Start flask web server.')
        global FlaskApp

        # enable cors
        log.info('Flask', 'Enable cors of flask app.')
        CORS(FlaskApp, supports_credentials=True)  # resources={"/api/*": {"origins": "*://*"}}) # must set supports_credentials = True for sessionCookie.

        # login
        log.info('Flask', 'Set secret key for login.')
        FlaskApp.secret_key = self.secret
        FlaskApp.config['SESSION_COOKIE_SECURE'] = False
        FlaskApp.permanent_session_lifetime = datetime.timedelta(minutes=20)
        FlaskApp.before_request(self.before_request)
        # FlaskApp.after_request(self.after_request)
        self.run()

    # callback before every request
    def before_request(self):
        session.modified = True

    # callback after ever request
    # def after_request(self, response):
    #     pass

    # ============ RUN ==================
    def threadbody(self):
        global FlaskApp
        serve(FlaskApp, host=self.host, port=self.port)

    def run(self):
        log.info('Flask', 'Flask web server started successfully at %s:%s.' % (self.host, self.port))
        if self.isDebug:
            os.environ['FLASK_ENV'] = 'development'
            FlaskApp.run(host=self.host, port=self.port, debug=True)
        else:
            self.thread = threading.Thread(target=self.threadbody)
            self.thread.setDaemon(True)
            self.thread.start()
        log.info('Flask', 'Web service was initialized successfully.')

    def getapp(self):
        global FlaskApp
        return FlaskApp
