from utils import *
import sqlite3
import hashlib
from datetime import datetime, date, timedelta
from shutil import copyfile


def md5sum(t):
    return hashlib.md5(t.encode()).hexdigest()


_sqlitedbclass = None


class sqlite():
    @staticmethod
    def getInstance():
        global _sqlitedbclass
        if _sqlitedbclass == None:
            _sqlitedbclass = sqlite()
            _sqlitedbclass.connect()
        return _sqlitedbclass

    def connect(self):
        try:
            self.path = setting.getAbsolutePath(setting.getsetting('SQLITE').get('PATH'))
            log.info('SQLite', 'Connecting database at %s' % self.path)

            conn = sqlite3.connect(self.path)
            conn.create_function("md5", 1, md5sum)
            c = conn.cursor()

            # get the count of tables with the name
            c.execute(" SELECT count(name) FROM sqlite_master WHERE type='table' AND name='users' ")
            ret = c.fetchone()[0]
            conn.close()

            # if the count is not 1, then table doesn't exists.
            if ret != 1:
                while True:
                    w = input("SQLite", " Database doesn't exist. Do you want to migrate it now? (Y)/(N):")
                    if w == 'Y' or w == 'y':
                        self.migrate()
                    if w == 'N' or w == 'n':
                        break
        except Exception as e:
            log.error('SQLite', 'Connection failed: % s' % str(e))

    def migrate(self):
        try:
            # migrate user
            conn = sqlite3.connect(self.path)
            conn.create_function("md5", 1, md5sum)
            c = conn.cursor()

            log.info('SQLite', 'Migration start. %s' % setting.getSQLiteMigrationPath())
            f = open(setting.getSQLiteMigrationPath(), 'r')
            for line in f.readlines():
                line = line.strip()
                if len(line) > 0 and line[0] != '-':
                    c.execute(line)
                    conn.commit()
            conn.close()
            f.close()

        except Exception as e:
            log.error('SQLite', 'Migration failed %s' % str(e))

    def select(self, sql):
        measure = measuretime("SQLite", "Execute time of <%s>: " % sql)
        res = []
        try:
            conn = sqlite3.connect(self.path)
            conn.create_function("md5", 1, md5sum)
            c = conn.cursor()
            c.execute(sql)
            res = c.fetchall()
            c.close()
            conn.close()

        except Exception as e:
            log.error('SQLite', 'SQL:<%s> error with %s' % (sql, str(e)))

        measure.stop()
        return res

    def execute(self, sql):
        measure = measuretime("SQLite", "Execute time of <%s>: " % sql)
        try:
            conn = sqlite3.connect(self.path)
            conn.create_function("md5", 1, md5sum)
            c = conn.cursor()
            res = c.execute(sql)
            conn.commit()
            conn.close()
            measure.stop()

        except Exception as e:
            log.error('SQLite', 'SQL:<%s> error with %s' % (sql, str(e)))
            measure.stop()
            return False

        return True

    def getPriceFromApi(self, userid, api):
        try:
            conn = sqlite3.connect(self.path)
            conn.create_function("md5", 1, md5sum)
            c = conn.cursor()
            c.execute("SELECT price FROM api_price WHERE userid=%d AND path = '%s'" % (userid, api))
            res = c.fetchall()
            c.close()
            conn.close()
            if len(res) > 0:
                return res[0][0]
        except Exception as e:
            log.error('SQLite', 'getPriceFromApi function error with %s' % (str(e)))
        return 0

    def addAction(self, userid, api, identification, letra='', tramite=''):
        if tramite != '':
            self.execute("INSERT INTO user_actions(userid, api, identification, letra, tramite, price, fecha) VALUES ( %d, '%s', '%s', '%s', %s, %s, '%s' )"
                         % (userid, api, identification, letra, tramite, self.getPriceFromApi(userid, api), datetime.now().isoformat()))
        else:
            self.execute("INSERT INTO user_actions(userid, api, identification, letra, price, fecha) VALUES ( %d, '%s', '%s', '%s', %s, '%s' )"
                         % (userid, api, identification, letra, self.getPriceFromApi(userid, api), datetime.now().isoformat()))

    def dailyBackup(self):
        log.info('SQLite', 'Backup database at ' + str(datetime.now()))
        try:
            copyfile(setting.getSQLiteDBPath(), setting.getSQLiteDBPath()+datetime.today().strftime(".%d-%m-%Y.")+"backup")
        except Exception as e:
            log.printError('SQLite', 'Error while backup database. Details: %s', str(e))
