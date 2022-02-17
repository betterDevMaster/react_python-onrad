from web.flask_server import flask_server
from service import scp, scheduler
import sys
import time
import os
# from dicom import scp

if __name__ == '__main__':
    os.chdir(os.path.dirname(sys.argv[0]))
    scp.getInstance().start()
    scheduler.getInstance().start()
    flask_server.getInstance().start()
    while True:
        time.sleep(100)
print('Quit.')
quit(0)