# ==========================================================================
# User Class
# Properties:
#               id:
#               name:
#               password:
#               enabledapis: all api string can be accessed for certain user
# Methods:
#               canAccess(api): whether user can access the api or not
# ==========================================================================
import hashlib
# import re

from web.auth.mysession import mysession
from utils import log
from database import sqlite

g_users = []


class User():

    def __init__(self, id, name, password, backend, frontend, email, type, status, manager, lastAccess):
        self.id = id
        self.name = name
        self.password = password
        self.backend = backend
        self.frontend = frontend
        self.email = email
        self.type = type
        self.status = status
        self.manager = manager
        self.lastAccess = lastAccess

    def __repr__(self):
        return "%d/%s/%s" % (self.id, self.name, self.password)

    def canAccess(self, backend_api):
        if self.backend == '*':
            return True

        for api in self.backend.split(','):
            api = api.strip()
            if api == '*':
                return True
            if api == backend_api:
                return True
        return False

    def login(self):
        mysession.set('userid', self.id)

    def logout(self):
        log.info("Logout =>", self.name)
        mysession.remove('userid')

    @staticmethod
    def getCurrentUser():
        userid = mysession.get('userid')
        for user in g_users:
            if user.id == userid:
                return user
        return None

    @staticmethod
    def getValidUserBy(name, password):
        for user in g_users:
            if user.name == name and user.password == hashlib.md5(password.encode()).hexdigest():
                return user
        return None

    @staticmethod
    def reload():
        log.info('Auth', 'Load users information from SQLite Database.')
        list = sqlite.getInstance().select("SELECT id, name, passwd, backend, frontend, email, props, status, manager, lastAccess FROM users;")
        global g_users
        g_users = []
        for rec in list:
            g_users.append(User(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8], rec[9]))

    @staticmethod
    def getUserById(userid):
        for user in g_users:
            if user.id == userid:
                return user
        return None


User.reload()
