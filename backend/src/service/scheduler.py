import datetime
from datetime import date
import time
import threading
import sys
import os
import shutil
from utils import setting, log
from database import sqlite

from service import s3, scu, web

_inst = None


class scheduler():
    @staticmethod
    def getInstance():
        try:
            global _inst
            if _inst == None:
                _inst = scheduler()
            return _inst
        except Exception as e:
            log.error('Scheduler', str(e))
        return None

    def __init__(self):
        self.running = False

    def start(self):
        if self.running == False:
            self.running = True
            self.thread = threading.Thread(target=self.update)
            self.thread.setDaemon(True)
            self.thread.start()

    def update(self):
        while True:
            time.sleep(10)
            try:
                ret = sqlite.getInstance().select("SELECT time_upload FROM origin")
                CHECK_DIR_INTERVAL = 60 * ret[0][0]
                # check all sub folder in upload directory
                for f in os.scandir(self.getUploadFolder()):
                    # if the folder was created before CHECK_DIR_INTERVAL seconds.
                    if f.is_dir() and (time.time()-os.path.getmtime(f)) > CHECK_DIR_INTERVAL:

                        # log.info('Scheduler', 'Working with folder %s' % f.name)
                        study_id = f.name

                        # move them to temp folder
                        dstFolderPath = self.moveFolderToTemp(study_id)

                        # zip folder as file and delete dcm folder.
                        image_count = len(os.listdir(dstFolderPath))
                        zip_name = self.zipFolder(dstFolderPath)

                        # get uploaded file path
                        today = datetime.datetime.today()
                        year = today.year
                        month = today.month
                        day = today.day
                        ret = sqlite.getInstance().select("SELECT study_date FROM history WHERE id='%s'" % study_id)
                        if len(ret) > 0:
                            examdate = ret[0][0]
                            year = int(examdate[0:4])
                            month = int(examdate[5:7])
                            day = int(examdate[8:10])
                        aws_path = "%s/%d/%d/%d/%s.zip" % (web.getInstance().originInfo['originId'], year, month, day, study_id)

                        # upload zip to AWS s3
                        s3.getInstance().upload_to_aws(zip_name, aws_path, image_count)
                        sqlite.getInstance().execute("UPDATE history SET cloud_file_path='%s' WHERE id='%s'" % (aws_path, f.name)) # set record
                        
                        # send files to other SCP (lunch Sender)
                        scu.getInstance().send_to_scp(f.path, f.name)
                        shutil.rmtree(f.path)

                # check all sub folder in temp dir whether it was modified before 48 hours
                ret = sqlite.getInstance().select("SELECT time_new_study FROM origin")
                CHECK_TEMPDIR_INTERVAL = 60 * ret[0][0]
                for f in os.scandir(self.getTempFolder()):
                    if f.is_dir() and (time.time()-os.path.getmtime(f)) > CHECK_TEMPDIR_INTERVAL:
                        log.info('Scheduler', 'Remove /files/dcm_temp/%s and consider the later files with same StudyID as new.' % f.name)
                        ret = sqlite.getInstance().execute("UPDATE history SET id='{}' WHERE id='{}'".format(f.name, f.name.split('-')[0]))
                        shutil.rmtree(f.path)
            except Exception as e:
                log.error('Scheduler', e)
                pass
            

    def getUploadFolder(self):
        return setting.getAbsolutePath('/files/dcm')

    def getTempFolder(self):
        return setting.getAbsolutePath('/files/dcm_temp')

    def zipFolder(self, path):
        zipName = shutil.make_archive(path, 'zip', path)
        log.info('Scheduler', '%s was zipped to %s file to be ready for uploading to S3.' % (path, zipName))
        # shutil.rmtree(path)
        return zipName

    def moveFolderToTemp(self, studyId):
        ret = sqlite.getInstance().select("SELECT COUNT(*) FROM history WHERE id like '%{}-%'".format(studyId))
        dstFolder = '%s-%d' % (studyId, ret[0][0] + 1)
        dstFolderPath = self.getTempFolder() + '/' + dstFolder
        srcFolderPath = self.getUploadFolder() + '/' + studyId
        if not os.path.exists(dstFolderPath):
            os.makedirs(dstFolderPath)
        for file in os.scandir(srcFolderPath):
            shutil.copy(file, dstFolderPath)
        return dstFolderPath
