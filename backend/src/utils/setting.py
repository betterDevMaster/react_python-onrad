import os
import jstyleson

ENV_SETTINGS = None
ROOT_DIR = "{0}/../..".format(os.path.dirname(os.path.abspath(__file__)))


class setting:
    # ===== load environment from setting.json
    @staticmethod
    def loadsettings():
        try:
            settingsPath = "{0}/setting.json".format(ROOT_DIR)
            f = open(settingsPath, 'r')
            js_data = f.read()
            global ENV_SETTINGS
            ENV_SETTINGS = jstyleson.loads(js_data)
        except Exception as e:
            print("Load settings error. Run using default settings. Details: %s" % str(e))
            return False
        return True

    @staticmethod
    def getsetting(id):
        return ENV_SETTINGS.get(id)

    @staticmethod
    def getAbsolutePath(path):
        return ROOT_DIR + path
