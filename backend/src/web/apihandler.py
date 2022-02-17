from flask import make_response, jsonify, request
from web import FlaskApp
from web.auth import security, User
from utils import log, measuretime
from database import sqlite


class apihandler:
    methods = []
    api = ''
    guest = False
    procedure = None
    timecheck = False

    def __init__(self, params):
        self.methods = params.get('methods')
        self.api = '/api' + params.get('api')
        self.guest = True # params.get('guest')
        self.procedure = params.get('procedure')
        self.timecheck = params.get('timecheck')

        log.info('Flask', 'Add api %s' % self.api)
        FlaskApp.add_url_rule(rule=self.api, methods=self.methods, endpoint=self.api, view_func=self.router)

    def router(self):
        mes = measuretime("Flask", "Request of %s was resolved in" % self.api)
        log.info('Flask', 'Api request: %s' % self.api)

        ret = False
        json = {'success': False, 'message': ''}
        # 1. check request... (time, user access)
        if self.guest:
            ret = security.checkRequest(json=json, timecheck=self.timecheck)
        else:
            ret = security.checkRequest(api=self.api, json=json, timecheck=self.timecheck)

        # 2. process
        if ret:
            json = self.procedure(self.api)

        # 3. log.
        if json.get('success') == True and json.get('count') > 0:
            log.info("Flask", "Response with success { userid: %s, username: '%s', api: '%s', identification: '%s', result: %s, message: None }" % (
                None if User.getCurrentUser() == None else User.getCurrentUser().id,
                None if User.getCurrentUser() == None else User.getCurrentUser().name,
                self.api,
                request.secure_arguments.get('identification'),
                json.get('count')
            )
            )
        if json.get('success') == False and json.get('message') == None:
            log.info("Flask", "Response with failed { userid: %s, username: '%s', api: '%s', identification: '%s', result: 0, message: None }" % (
                None if User.getCurrentUser() == None else User.getCurrentUser().id,
                None if User.getCurrentUser() == None else User.getCurrentUser().name,
                self.api,
                request.secure_arguments.get('identification'),
            )
            )

        if json.get('success') == False and json.get('message') != None:
            log.info("Flask", "Response with error { userid: %s, username: '%s', api: '%s', identification: '%s', result: None, message: '%s' }" % (
                None if User.getCurrentUser() == None else User.getCurrentUser().id,
                None if User.getCurrentUser() == None else User.getCurrentUser().name,
                self.api,
                request.secure_arguments.get('identification'),
                json.get('message')
            )
            )
        if json.get('count') != None:
            del json['count']

        mes.stop()
        return json
