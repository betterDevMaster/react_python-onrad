from pydicom import dcmread
from pynetdicom import AE, StoragePresentationContexts, ALL_TRANSFER_SYNTAXES, AllStoragePresentationContexts
from pynetdicom.sop_class import ComputedRadiographyImageStorage, MRImageStorage, CTImageStorage, UltrasoundMultiframeImageStorage, UltrasoundImageStorage,SecondaryCaptureImageStorage
from pydicom.uid import JPEGLossless
import os

from utils import setting, log
from database import sqlite
from service.web import web
_inst = None

class scu():
    @staticmethod
    def getInstance():
        try:
            global _inst
            if _inst == None:
                _inst = scu()
            return _inst
        except Exception as e:
            log.error('SCU', e)
        return None

    def send_to_scp(self, folder_path, studyId):
        ret = True
        for scp in self.getList():
            if scp['active']:
                ret = ret & self.send(folder_path, scp['ae_title'], scp['host'], scp['port'])
        if ret == True:
            web.getInstance().setDicomStatus(
                studyId, #studyId, dicomSituationId, fileName, fileSize, imagesCount
                6,
                "%s.zip" % studyId,
                0,
                len(os.listdir(folder_path))
            )

    def send(self, folder_path, ae_title, host, port):
        trycount = 2
        while trycount>=0:
            trycount = trycount -1
            log.info('Sender', 'Sending images from %s to PAC %s(%s:%s)' % (folder_path, ae_title, host, port) )
            try:
                ae = AE(ae_title=b'ONRAD')
                # ae.ae_title = b'ANY-SCP'
                # transfer_syntax = JPEGLossless
                # for syntax in ALL_TRANSFER_SYNTAXES:
                #     transfer_syntax += syntax 
                # ae.add_supported_context(CTImageStorage, scu_role=True, scp_role=True)
                # for context in StoragePresentationContexts:
                #     ae.add_requested_context(context.abstract_syntax, ALL_TRANSFER_SYNTAXES)
                ae.add_requested_context(ComputedRadiographyImageStorage)
                ae.add_requested_context(MRImageStorage)
                ae.add_requested_context(CTImageStorage)
                ae.add_requested_context(UltrasoundImageStorage)
                ae.add_requested_context(UltrasoundMultiframeImageStorage)
                ae.add_requested_context(SecondaryCaptureImageStorage)

                assoc = ae.associate(addr=host, port=port, ae_title=ae_title)
                if assoc.is_established:
                    for f in os.scandir(folder_path):
                        dataset = dcmread(f.path)
                        # `status` is the response from the peer to the store request
                        # but may be an empty pydicom Dataset if the peer timed out or
                        # sent an invalid dataset.
                        status = assoc.send_c_store(dataset)

                    assoc.release()
                    log.info('SCU', 'Send dcm files to %s:%s successful.' % (host, port))
                    return True
                log.error('SCU', 'Error in sending dcm files to %s:%s.' % (host, port))
            except Exception as e:
                log.error('SCU', 'Error in sending dcm files to %s:%s. Detail: %s' % (host, port, str(e)))
        return False

    def getList(self):
        sculist = []
        ret = sqlite.getInstance().select('SELECT id, host, port, ae_title, active FROM sender;')
        for rec in ret:
            sculist.append({
                'id': rec[0],
                'host': rec[1],
                'port': int(rec[2]),
                'ae_title': rec[3],
                'active': rec[4],
            })
        return sculist
