from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

from utils import setting, log

PRIVATE_KEY = None
PUBLIC_KEY = None


class keymaker:
    @staticmethod
    def createKey():
        # create private key and store it in /files/keys/public_key.pem
        try:
            log.info('Cryptography', 'Create private key and store it in local.', setting.getAbsolutePath(setting.getsetting('KEY_PRIVATE')))
            secret_access_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
                backend=default_backend()
            )
            pem = secret_access_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            with open(setting.getAbsolutePath(setting.getsetting('KEY_PRIVATE')), 'wb') as f:
                f.write(pem)
        except Exception as e:
            log.error("Cryptography", "Failed in creating private key. details: %s" % str(e))

        try:
            log.info('Cryptography', 'Create public key and store it in local.', setting.getAbsolutePath(setting.getsetting('KEY_PUBLIC')))
            public_key = secret_access_key.public_key()
            pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            with open(setting.getAbsolutePath(setting.getsetting('KEY_PUBLIC')), 'wb') as f:
                f.write(pem)
        except Exception as e:
            log.error("Cryptography", "Failed in creating public key. details: %s" % str(e))

    @ staticmethod
    def readKey():
        # read private key file
        try:
            log.info('Cryptography', 'Read private key.')
            with open(setting.getAbsolutePath(setting.getsetting('KEY_PRIVATE')), "rb") as key_file:
                global PRIVATE_KEY
                PRIVATE_KEY = serialization.load_pem_private_key(
                    key_file.read(),
                    password=None,
                    backend=default_backend()
                )
        except Exception as e:
            log.error("Cryptography", "Failed in reading private key. details: %s" % str(e))

        # read public key file
        try:
            log.info('Cryptography', 'Read public key.')
            with open(setting.getAbsolutePath(setting.getsetting('KEY_PUBLIC')), "rb") as key_file:
                global PUBLIC_KEY
                PUBLIC_KEY = serialization.load_pem_public_key(
                    key_file.read(),
                    backend=default_backend()
                )
        except Exception as e:
            log.error("Cryptography", "Failed in reading public key. details: %s" % str(e))

    @ staticmethod
    def getPrivateKey():
        global PRIVATE_KEY
        return PRIVATE_KEY

    @ staticmethod
    def getPublicKey():
        global PUBLIC_KEY
        return PUBLIC_KEY
