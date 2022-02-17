import time
from utils.log import log


class measuretime:
    def __init__(self, head, msg):
        self.head = head
        self.msg = msg
        self.starttime = time.time_ns()

    def stop(self):
        measure = time.time_ns() - self.starttime
        log.info(self.head, "%s %sms" % (self.msg, str(measure/1000000)))
        return measure
