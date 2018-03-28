from Crypto.Hash import SHA
from Crypto.PublicKey import RSA
from Crypto.Util.number import bytes_to_long
from base64 import urlsafe_b64encode, urlsafe_b64decode


def sha_of(content):
    content_hashing = SHA.new()
    content_hashing.update(content.encode('utf-8'))
    content_hash = content_hashing.hexdigest()


def b64dec(s):
    """
    URL-safe Base64 decode, adding padding characters as necessary
    @type  s: string
    @param s: A base64url-encoded string (padding optional)
    @rtype: byte string
    @return: The octet string decoded from the encoded value
    """
    if len(s) == 0:
        return b''
    return urlsafe_b64decode(str(s + '='*(4-(len(s)%4))))


def load_publickey(jwk):
    n_b64 = jwk.get('n')
    n = bytes_to_long(b64dec(n_b64))
    e_b64 = jwk.get('e')
    e = bytes_to_long(b64dec(e_b64))
    publickey = RSA.construct((n, e))
    return publickey
