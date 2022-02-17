# import csv
from utils import setting, time
import sys
import linecache


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class log:
    # ================== LOG =====================================
    @staticmethod
    def info(head, msg, toFile=True, logFolder=''):
        print(time.now() + " " + bcolors.OKGREEN + "[" + head + "]" + bcolors.ENDC + " %s" % msg)
        if toFile == True:
            log.file(setting.getAbsolutePath(setting.getsetting('LOG')) + "/" + time.today() + ".info.log", head, msg)

    # =================== ERROR ====================================
    @staticmethod
    def error(head, msg, toFile=True, logFolder=''):
        print(time.now() + " " + bcolors.FAIL + "[" + head + "]" + bcolors.ENDC + " %s" % msg)
        if toFile == True:
            log.file(setting.getAbsolutePath(setting.getsetting('LOG')) + "/" + time.today() + ".error.log", head, msg)
        log.exception()

    # ====================== log to file =========================
    @staticmethod
    def file(filepath, head, msg):
        fp = open(filepath, "a")
        fp.write(time.now() + '\t[' + head + ']' + '\t' + msg + '\n')
        fp.close()

    @staticmethod
    def exception():
        exc_type, exc_obj, tb = sys.exc_info()
        if tb != None:
            f = tb.tb_frame
            lineno = tb.tb_lineno
            filename = f.f_code.co_filename
            linecache.checkcache(filename)
            line = linecache.getline(filename, lineno, f.f_globals)
            error = '\t\t' + bcolors.OKBLUE + 'More details: Line %s in %s : %s' % (lineno, filename, line.strip()) + bcolors.ENDC
            print(error, end='\r\n')
