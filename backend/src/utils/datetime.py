from datetime import datetime

class time:
    
    @staticmethod
    def now():
        return datetime.now().strftime("%Y/%m/%d %H:%M:%S")

    @staticmethod
    def today():
        return datetime.now().strftime("%Y%m%d")

    @staticmethod
    def toString(timeObject):
        return timeObject.strftime("%Y/%m/%d %H:%M:%S")
    
    @staticmethod
    def toDateString(timeObject):
        return timeObject.strftime("%Y/%m/%d")
    
    @staticmethod
    def toTimeString(timeObject):
        return timeObject.strftime("%H:%M:%S")
