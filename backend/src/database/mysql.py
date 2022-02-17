from mysql.connector import connect
from utils import setting, log

_mysqlinstance = None


class mysql():
    @staticmethod
    def getInstance():
        """sdfsdf"""
        global _mysqlinstance
        if _mysqlinstance == None:
            _mysqlinstance = mysql()
        return _mysqlinstance

    def __init__(self):
        self.settings = setting.getsetting("MYSQL")
        self.host = self.settings.get('HOST')
        self.port = self.settings.get('PORT')
        self.user = self.settings.get('USER')
        self.passwd = self.settings.get('PASSWORD')

    def migrate(self):
        dbs = self.select("SHOW DATABASES")
        for db in dbs:
            if db[0] == 'maciel_dicom':
                return False    # [maciel_dicom] database already exist. No need to execute migrate.
        migrationPath = setting.getAbsolutePath(self.settings.get("MIGRATION"))
        log.info("MYSQL", "Database will be migrated with %s." % migrationPath)
        with open(migrationPath) as f:
            self.execute(f.read(), multi=True)
            f.close()

    def connect(self):
        try:
            self.mydb = connect(
                host=self.host,
                port=self.port,
                user=self.user,
                passwd=self.passwd
            )
            log.info("MYSQL", "MYSQL is connected at %s:%s" % (self.host, self.port))

            self.migrate()
        except Exception as identifier:
            log.error("MYSQL", "%s" % str(identifier))
            return False
        return True

    def select(self, sql):
        try:
            cursor = self.mydb.cursor()
            cursor.execute(sql)
            ret = cursor.fetchall()
            cursor.close()
            return ret
        except Exception as identifier:
            log.error("MYSQL", "%s" % str(identifier))
            return []

    def execute(self, sql, multi=False):
        try:
            cursor = self.mydb.cursor()
            result = cursor.execute(sql, multi=multi)
            if multi == True:
                result.send(None)
            self.mydb.commit()
            return True
        except Exception as identifier:
            self.mydb.rollback()
            log.error("MYSQL", "%s" % str(identifier))
            return False
