from utils import setting, log
from database import sqlite
from pydicom.uid import ExplicitVRLittleEndian
from pynetdicom import AE, debug_logger, evt, AllStoragePresentationContexts, VerificationPresentationContexts, ALL_TRANSFER_SYNTAXES
from pynetdicom._globals import ALL_TRANSFER_SYNTAXES, DEFAULT_MAX_LENGTH
from pydicom._storage_sopclass_uids import CTImageStorage
from pydicom.filewriter import write_file_meta_info
from datetime import datetime
from pprint import pprint
import os
from service.web import web

_inst = None


class scp():
    @staticmethod
    def getInstance():
        try:
            settings = setting.getsetting("SCP")
            global _inst
            if _inst == None:
                _inst = scp()
            return _inst
        except Exception as e:
            log.error('SCP', e)
        return None

    def loadSettingFromDatabase(self):
        ret = sqlite.getInstance().select("SELECT id, port, ae_title, modality_ignore FROM origin;")
        if ret != None:
            self.host = '0.0.0.0'
            self.origin_id = ret[0][0]
            self.port = ret[0][1]
            self.ae_title = ret[0][2]
            self.modality_ignore = ret[0][3]
            self.store_path = setting.getAbsolutePath('/files/dcm')

    def __init__(self):
        self.scp = None
        self.host = ''
        self.origin_id = 0
        self.port = 0
        self.ae_title = ''
        self.store_path = ''
        self.modality_ignore = ''

    def status(self):
        return {
            'running': self.scp != None,
            'id': self.origin_id,
            'port': self.port,
            'ae_title': self.ae_title,
            'modality_ignore': self.modality_ignore
        }

    def stop(self):
        if self.scp != None:
            self.scp.shutdown()
            log.info("SCP", "SCP is stopped.")
            self.scp = None
            return True
        log.error("SCP", " SCP was not started yet.")
        raise Exception('SCP was not started yet.')

    def start(self):
        if self.scp == None:
            self.loadSettingFromDatabase()
            log.info("SCP", "SCP is running at %s:%s" % (self.host, self.port))

            ae = AE()
            transfer_syntax = ALL_TRANSFER_SYNTAXES[:]

            # Add presentation contexts with specified transfer syntaxes
            for context in AllStoragePresentationContexts:
                ae.add_supported_context(context.abstract_syntax, transfer_syntax)

            for context in VerificationPresentationContexts:
                ae.add_supported_context(context.abstract_syntax, transfer_syntax)

            handlers = [(evt.EVT_C_STORE, self.handle_store), (evt.EVT_C_ECHO, self.handle_echo)]
            # handlers = [(evt.EVT_C_STORE, handle_store, [args, APP_LOGGER])]

            # ae.maximum_pdu_size = args.max_pdu
            # # Set timeouts
            # ae.network_timeout = args.network_timeout
            # ae.acse_timeout = args.acse_timeout
            # ae.dimse_timeout = args.dimse_timeout

            self.scp = ae.start_server((self.host, self.port), evt_handlers=handlers, block=False)
            return True
        log.error("SCP", " SCP was already running.")
        raise Exception('SCP was already running.')

    def handle_echo(self, event):
        # Every *Event* includes `assoc` and `timestamp` attributes
        #   which are the *Association* instance the event occurred in
        #   and the *datetime.datetime* the event occurred at
        requestor = event.assoc.requestor
        timestamp = event.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        msg = "Received C-ECHO service request from ({}, {}) at {}".format(requestor.address, requestor.port, timestamp)
        log.info('S3', msg)
        # Return a *Success* status
        return 0x0000

    def handle_store(self, event):
        try:
            if event.is_cancelled == True:
                log.info("SCP", "Event was canceled.")
                return 0x0001
            else:
                self.store(event)
                return 0x0000
        except Exception as e:
            log.error('SCP', str(e))

        return 0x0001

    def store(self, event):
        try:
            # 1. is Modality Type in Ignore modality array?
            modality = event.dataset[0x0008, 0x0060].value
            if modality in self.modality_ignore:
                log.error('SCP', 'Image which should be ignored by setting was received and discarded. (MODALITY_IGNORE = %s, CURRENT MODALITY = %s)' % (self.modality_ignore, modality))
                return False

            # 2. get Study id
            study_uid = event.dataset[0x0020, 0x000d].value
            if study_uid == '' or study_uid == None:
                log.error('SCP', 'None StudyUID image was recieved and discarded.')
                return False
            # 3. ignore patient name rule?

            # 4. has AccessNumber?
            access_number = event.dataset[0x0008, 0x0050].value
            if access_number == '' or access_number == None:
                access_number = study_uid
                event.dataset[0x0008, 0x0050].value = access_number

            # 4. has PPID? if not, set as OriginID + CurrentTime
            ppid = event.dataset[0x0010, 0x0020].value
            if ppid == '' or ppid == None:
                ppid = self.origin_id + datetime.now().strftime("%d%m%Y%H%M%S")
                event.dataset[0x0010, 0x0020].value = ppid

            # 5. create Study folder
            study_id = web.getInstance().getStudyId(event.dataset)
            if study_id == '0':
                study_id = self.getValue(event, 0x0020, 0x0010)
                if study_id == '' or study_id == None:
                    pieces = study_uid.split('.')
                    event.dataset[0x0020, 0x0010].value = pieces[len(pieces)-1]
                    study_id = self.getValue(event, 0x0020, 0x0010)

            if os.path.isdir(self.store_path + "/" + study_id) == False:
                os.makedirs(self.store_path + "/" + study_id)

            with open(self.store_path + "/" + study_id + "/" + event.request.AffectedSOPInstanceUID + ".dcm", 'wb') as f:
                # Write the preamble and prefix
                f.write(b'\x00' * 128)
                f.write(b'DICM')
                # Encode and write the File Meta Information
                write_file_meta_info(f, event.file_meta)
                # Write the encoded dataset
                f.write(event.request.DataSet.getvalue())
                log.info("SCP", "Image was received. %s" % ("/" + study_id + "/" + event.request.AffectedSOPInstanceUID + ".dcm"))

            self.record(event, study_id)

            return True
        except Exception as e:
            log.error('SCP', str(e))

    def getValue(self, event, id1, id2):
        ret = ""
        try:
            ret = event.dataset[id1, id2].value
        except Exception as identifier:
            pass
        return ret

    def record(self, event, study_id):
        try:
            ret = sqlite.getInstance().select("SELECT * FROM history WHERE id='%s' LIMIT 1;" % study_id)
            if len(ret) == 0:
                sql = "INSERT INTO `history`(" + \
                    "`id`," + \
                    "`origin_id`," + \
                    "`origin_name`," + \
                    "`record_time`," + \
                    "`cloud_file_path`," + \
                    "`modality`," + \
                    "`patient_id`," + \
                    "`patient_name`," + \
                    "`patient_sex`," + \
                    "`patient_age`," + \
                    "`patient_birthday`," + \
                    "`exam`," + \
                    "`accession_number`," + \
                    "`study_id`," + \
                    "`study_uid`," + \
                    "`referring_physicians_name`," + \
                    "`performing_physicians_name`," + \
                    "`study_date`" + \
                    ") VALUES(" + \
                    "\"%s\"," % study_id + \
                    "\"%s\"," % self.origin_id + \
                    "\"%s\"," % self.ae_title + \
                    "\"%s\"," % datetime.today() + \
                    "\"\"," + \
                    "\"%s\"," % self.getValue(event, 0x0008, 0x0060) + \
                    "\"%s\"," % self.getValue(event, 0x0010, 0x0020) + \
                    "\"%s\"," % self.getValue(event, 0x0010, 0x0010) + \
                    "\"%s\"," % self.getValue(event, 0x0010, 0x0040) + \
                    "\"%s\"," % self.getValue(event, 0x0010, 0x1010) + \
                    "\"%s\"," % self.getValue(event, 0x0010, 0x0030) + \
                    "\"%s\"," % self.getValue(event, 0x0008, 0x1030) + \
                    "\"%s\"," % self.getValue(event, 0x0008, 0x0050) + \
                    "\"%s\"," % self.getValue(event, 0x0020, 0x0010) + \
                    "\"%s\"," % self.getValue(event, 0x0020, 0x000d) + \
                    "\"%s\"," % self.getValue(event, 0x0008, 0x0090) + \
                    "\"%s\"," % self.getValue(event, 0x0008, 0x1050) + \
                    "\"%s\")" % datetime.strptime('%s %s' % (self.getValue(event, 0x0008, 0x0020), self.getValue(event, 0x0008, 0x0030)) , '%Y%m%d %H%M%S.%f')
                sqlite.getInstance().execute(sql)
        except Exception as e:
            log.error('S3', 'Error in logging hoistory. Details: %s' % str(e))
