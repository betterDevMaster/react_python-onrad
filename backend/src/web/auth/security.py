# =================== Security check ==================
# check login status
# find the special letter / log it / and make it safe
# =====================================================
# from flask_login import current_user, login_user
from flask import request
from datetime import datetime

from utils import log
from web.auth.users import User


class security:

    @staticmethod
    def checkRequest(api=None, json={}, timecheck=False):
        request.api = api
        request.secure_arguments = {}

        ret = True

        # check parameter
        ret = security.checkSecurityOfParams()
        if ret == False:
            json['message'] = 'Bad! You were attempting to attack with SQL injection.'
            return ret

        # check login...
        if api != None:
            retmsg = security.checkLogin(api)
            if retmsg != '':
                json['message'] = retmsg
                return False

        # check date...(root user can access anytime)
        if timecheck == True and User.getCurrentUser().id != 1:
            ret = security.checkTime()
            if ret == False:
                json['message'] = 'You can access this service only on Monday ~ Friday, at 8:10 AM ~ 5:30 PM.'
                return False
        return True

    @staticmethod
    def checkTime():
        current = datetime.now()
        if current.weekday() > 4:
            log.error('Security', '%s' % security.getDetailError(detail='User can access server only on from Monday to Friday.'))
            return False
        mins = current.hour * 60 + current.minute
        if mins < 8 * 60 + 10 or mins > (12 + 5) * 60 + 30:
            log.error('Security', '%s' % security.getDetailError(detail='User can access server only at from 8:10 AM to 5:30 PM.'))
            return False
        return True

    @staticmethod
    def checkLogin(api):
        # At first check current user is not null
        user = User.getCurrentUser()
        if user == None:
            log.error('Security', '%s' % security.getDetailError(detail='Session timeout or Invalid access without session.'))
            return 'Session timeout or Invalid access without session.'
        # whether user can access the api
        if not user.canAccess(api):
            log.error('Security', '%s' % security.getDetailError(detail='You have no permission to do this action. Please contact to administrator.'))
            return 'You have no permission to do this action. Please contact to administrator.'
        return ''

    # CHECK LOGIN and SQL INJECTION
    @staticmethod
    def checkSecurityOfParams():
        try:
            if request.args != None:
                for x in request.args:
                    if security.existSpecial(request.args.get(x)):
                        log.error('Security', '%s' % security.getDetailError(detail='Fuck! Detect SQL injection attack'))
                        return False
                    request.secure_arguments[x] = str(request.args.get(x))
        except Exception as e:
            log.error('Security', '%s' % security.getDetailError(detail=str(e)))
            return False

        try:
            if request.json != None:
                for x in request.get_json():
                    if security.existSpecial(request.json.get(x)):
                        log.error('Security', 'SQL injection attack found')
                        return False
                    request.secure_arguments[x] = str(request.json.get(x))
        except Exception as e:
            log.error('Security', 'Detail: %s' % str(e))
            return False

        try:
            if request.form != None:
                for x in request.form:
                    if security.existSpecial(request.form.get(x)):
                        log.error('Security', 'SQL injection attack found')
                        return False
                    request.secure_arguments[x] = str(request.form.get(x))
        except Exception as e:
            log.error('Security', 'Detail: %s' % str(e))
            return False

        return True

    @staticmethod
    def getUserDetail():
        user = User.getCurrentUser()
        return "{ api: '%s', userid: %s, username: '%s', identification: '%s', ip: '%s', platform: '%s', browser: '%s', version: '%s', language: '%s' }" % (
            request.api,
            None if user == None else user.id,
            None if user == None else user.name,
            request.secure_arguments.get('identification'),
            request.remote_addr,
            request.user_agent.platform,
            request.user_agent.browser,
            request.user_agent.version,
            request.user_agent.language
        )

    @staticmethod
    def getDetailError(detail=''):
        user = User.getCurrentUser()
        return "{ api: '%s', userid: %s, username: '%s', identification: '%s', ip: '%s', platform: '%s', browser: '%s', version: '%s', language: '%s', detail: '%s' }" % (
            request.api,
            None if user == None else user.id,
            None if user == None else user.name,
            request.secure_arguments.get('identification'),
            request.remote_addr,
            request.user_agent.platform,
            request.user_agent.browser,
            request.user_agent.version,
            request.user_agent.language,
            detail
        )

    @staticmethod
    def existSpecial(val):
        val = str(val)
        return val.find('&') >= 0 or val.find('<') >= 0 or val.find('>') >= 0 or val.find('"') >= 0 or val.find("'") >= 0
