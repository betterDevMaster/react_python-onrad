from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding

from web.auth.keymaker import keymaker


class crypt:
    @staticmethod
    def decrypt(encrypted):
        secret_access_key = keymaker.getPrivateKey()
        return secret_access_key.decrypt(
            encrypted,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

    @staticmethod
    def encrypt(message):
        public_key = keymaker.getPublicKey()
        return public_key.encrypt(
            message.encode('ascii'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
