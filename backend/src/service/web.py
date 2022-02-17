import requests
from database import sqlite
import binascii
import json
from utils import setting, log
import datetime

_inst = None


class web():
    @staticmethod
    def getInstance():
        global _inst
        if _inst == None:
            _inst = web()
        return _inst

    def __init__(self):
        self.url = 'http://betaacesso.onrad.com.br:8090/onrad/rest'
        self.user = 'demomd'
        self.passwd = '213cd94ae697ee41b2ad886d3c736418'
        self.sessionToken = ''
        self.sessionUserId = ''
        self.originInfo = {'originId':'', 'originName':''}
        self.loadsetting()

    def setDicomStatus(self, studyId, dicomSituationId, fileName, fileSize, imagesCount):
        log.info('Web', 'Set dicom situation as %d for %s(size: %d, images: %d).' % (dicomSituationId, fileName, fileSize, imagesCount))
        param = '{"sessionUserId": "%s", "sessionToken": "%s","studyId":"%s","dicomSituationId":"%s","fileName":"%s","fileSize":"%s","imagesCount":"%d"}' % (
            self.sessionUserId,
            self.sessionToken,
            studyId,
            dicomSituationId,
            fileName,
            fileSize,
            imagesCount
        )
        j = self.get('TStudy/SetDicomSituation', param)
        if j != None:
            if j['result'][0].get('error') == '0':
                return True
        return False

    def getStudyId(self, dataset):
        studyUID = self.getValue(dataset, 0x0020, 0x000D)
        ret = sqlite.getInstance().select("SELECT studyID FROM study WHERE studyUID='%s' and originId='%s' and originName='%s'" % (
            studyUID, self.originInfo['originId'], self.originInfo['originName']
            ))
        if ret!=None and len(ret)==1:
            return ret[0][0]

        trycount = 1
        while trycount>=0:
            trycount = trycount -1
            param = '{"sessionUserId": "%s", "sessionToken": "%s","studyId":"%s","originId":"%s","originName":"%s","modality":"%s","pPID":"%s","patientName":"%s","patientSex":"%s","patientAge":"%s","exam":"%s","dicomSituationId":"%s","accessionNumber":"%s","studyUID":"%s","referringPhysiciansName":"%s","performingPhysiciansName":"%s","date":"%s","patientBirthDate":"%s"}' % (
                self.sessionUserId,
                self.sessionToken,
                '0',
                self.originInfo['originId'],
                self.originInfo['originName'],
                self.getValue(dataset, 0x0008, 0x0060),     # modality          tag (0008, 0060)
                self.getValue(dataset, 0x0010, 0x0020),     # patient id        tag (0010, 0020) 
                self.getValue(dataset, 0x0010, 0x0010),     # patient name      tag (0010, 0010) 
                self.getValue(dataset, 0x0010, 0x0040),     # patient sex       tag (0010, 0040) 
                self.getValue(dataset, 0x0010, 0x1010),     # paitent age       tag (0010, 1010) 
                self.getValue(dataset, 0x0008, 0x1030),     # exam              tag (0008, 1030) or (0018, 0015) or (0032, 1060) or (0010, 4000)
                '2',                                        # dicomSituationId  2, Receiving images / Preparing for shipment
                self.getValue(dataset, 0x0008, 0x0050),     # accessionNumber   tag (0008, 0050) 
                self.getValue(dataset, 0x0020, 0x000D),     # studyUID          tag (0020,000D)
                self.getValue(dataset, 0x0008, 0x0090),     # referringPhysiciansName   tag (0008, 0090) 
                self.getValue(dataset, 0x0008, 0x1050),     # performingPhysicians Name tag (0008, 1050) 
                '%s' % datetime.datetime.strptime('%s %s' % (self.getValue(dataset, 0x0008, 0x0020), self.getValue(dataset, 0x0008, 0x0030)) , '%Y%m%d %H%M%S.%f').strftime('%d/%m/%Y %H:%M:%S'), # date            Tag (0008,0020) + (0008,0030) 
                self.getValue(dataset, 0x0010, 0x0030)      # patientBirthDate  tag (0010,0030) 
            )
            j = self.get('TStudy/Insert', param)
            if j != None:
                if j['result'][0].get('errorCode') == '1021':
                    self.getOriginInfo()
                    continue
                else:
                    studyId = j['result'][0].get('studyId')
                    if studyId != '0':
                        sqlite.getInstance().execute("INSERT INTO study(studyUID, studyID, originId, originName) VALUES('%s', '%s', '%s', '%s')" % (
                            studyUID, studyId, self.originInfo['originId'], self.originInfo['originName']
                            ))
                    return studyId
            return '0'

    def get(self, api, param):
        r = requests.get('%s/%s/%s' % (self.url, api, binascii.hexlify(param.encode('utf-8')).decode('utf-8')))
        if r.status_code == 200:
            return json.loads(r.text)
        return None
    
    def getValue(self, dataset, id1, id2):
        ret = ""
        try:
            ret = dataset[id1, id2].value
        except Exception as identifier:
            pass
        return ret

    def login(self):
        log.info('Web', 'Web bridge will login to ONROAD with user: %s, pass: %s' % (self.user,self.passwd))
        j = self.get('TUser/login', '{"user": "%s", "passwd": "%s"}' % (self.user, self.passwd))
        if j and j['result'] and j['result'][0] and j['result'][0]['error'] == '0':
            if j['result'][0]['loginStatus'] == '0':
                self.sessionToken = j['result'][0]['sessionToken']
                self.sessionUserId = j['result'][0]['userId']
                return True
            else:
                log.error('Web', 'Login failed.')
                return False
            return True
        return False

    def getOriginInfo(self):
        if self.login():
            log.info('Web', 'Web bridge will fetch Origin info from ONROAD with sessionUserId: %s, sessionToken: %s' % (self.sessionUserId,self.sessionToken))
            infostr = '{"sessionUserId": "%s", "sessionToken": "%s"}' % (self.sessionUserId, self.sessionToken)
            j = self.get('TOrigin/GetInfo', infostr)
            if j!= None:
                self.originInfo = j['result'][0]
                return True
        return False
    
    def loadsetting(self):
        log.info('Web', 'Web bridge setting will be reloaded.')
        ret = sqlite.getInstance().select("SELECT url, user, passwd FROM onroad")
        if ret != None and len(ret) > 0:
            self.url = ret[0][0]
            self.user = ret[0][1]
            self.passwd = ret[0][2]
        return self.getOriginInfo()
