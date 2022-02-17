import os
import boto3
from botocore.exceptions import NoCredentialsError
from utils import setting, log
from database import sqlite
from service.web import web

_inst = None


class s3():
    @staticmethod
    def getInstance():
        try:
            global _inst
            if _inst == None:
                _inst = s3()
            return _inst
        except Exception as e:
            log.error('S3', e)
        return None

    def upload_to_aws(self, local, dest, image_count):
        # set dicom status as "Transmitting images"
        filename = os.path.split(dest)[1]
        web.getInstance().setDicomStatus(
            filename.split('.')[0],    # studyID
            3,                          # "Transmitting images"
            filename,
            os.path.getsize(local),
            image_count
        )

        # send data to all s3 server
        s3_list = self.getList()
        for s3_server in s3_list:
            if s3_server['active']:
                self.uploadFile(s3_server['bucket_name'], s3_server['access_key_id'], s3_server['secret_access_key'], local, dest)
        
        # set dicom status as "Transmitting images"
        web.getInstance().setDicomStatus(
            filename.split('.')[0],     # studyID
            5,                          # Images are available for download
            filename,
            os.path.getsize(local),
            image_count
        )
        os.remove(local)

    def uploadFile(self, bucket_name, access_key_id, secret_access_key, local_path, dest_path):
        client = boto3.client('s3', aws_access_key_id=access_key_id,
                              aws_secret_access_key=secret_access_key)
        # rsc = boto3.resource('s3', aws_access_key_id=access_key_id,
        #                      aws_secret_access_key=secret_access_key)
        # bucket = rsc.Bucket(BUCKET_NAME)
        # if not bucket.creation_date:
        #     rsc.create_bucket(Bucket=BUCKET_NAME)
        # log.info('S3', "Uploading file %s to %s." % (local_path, dest_path))

        try:
            client.upload_file(local_path, bucket_name, dest_path)
            log.info('S3', "Upload file %s Successful to %s/%s." % (local_path, bucket_name, dest_path))
            return True
        except FileNotFoundError:
            log.error('S3', "The file was not found. %s" % local_path)
            return False
        except NoCredentialsError:
            log.error('S3', "Credentials not available")
            return False

    def downloadFileUrl(self, s3_id, filename):
        ret = sqlite.getInstance().select("SELECT bucket_name, access_key_id, secret_access_key FROM s3 WHERE id='%s'" % s3_id)
        if ret != None:
            bucket_name = ret[0][0]
            access_key_id = ret[0][1]
            secret_access_key = ret[0][2]
            ses = boto3.Session(aws_access_key_id=access_key_id,
                                aws_secret_access_key=secret_access_key)
            client = ses.client('s3')

            url = client.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': access_key_id,
                },
                ExpiresIn=600
            )
            return url
        return None

    def getList(self):
        s3list = []
        ret = sqlite.getInstance().select('SELECT id, username, passwd, access_key_id, secret_access_key, bucket_name, console, active FROM s3;')
        for rec in ret:
            s3list.append({
                'id': rec[0],
                'username': rec[1],
                'password': rec[2],
                'access_key_id': rec[3],
                'secret_access_key': rec[4],
                'bucket_name': rec[5],
                'console': rec[6],
                'active': rec[7],
            })
        return s3list
