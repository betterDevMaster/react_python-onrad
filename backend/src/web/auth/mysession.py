from flask import session

from web.auth.crypt import crypt
import random


class mysession:
    # set seesion key and value
    @staticmethod
    def set(key, value):
        # set value for key
        value = '{0},{1},{2}'.format(random.randrange(10000000, 99999999), value, random.randrange(1000000, 9999999))
        encValue = crypt.encrypt(value)
        session[key] = encValue
    # get value of key

    @staticmethod
    def get(key):
        # get value for key
        encVlaue = session.get(key)
        if encVlaue == None:
            return None
        value = crypt.decrypt(encVlaue).decode("utf-8")
        vals = value.split(",")
        if len(vals) == 3:
            return eval(vals[1])
        return None

    @staticmethod
    def remove(key):
        session.pop(key, None)
