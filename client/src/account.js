import {send} from './api.js';

export class Account {
    constructor() {
        this.plate = null;
        this.cypherKey = new CypherKey();
    }
    getKey() {
        return this.cypherKey;
    }
    submitSubcription = (publicKey) => {
        const subscription = {
            'plate': this.plate,
            'pub_key': publicKey
        };
        return send(subscription, 'users/me');
    }
    subscribe(plate) {
        this.plate = plate;
        this.cypherKey.generate()
            .then((keyPair) =>  {
                crypto.subtle.exportKey('jwk', keyPair.publicKey)
                    .then(this.submitSubcription);

            });
    }

}

export class CypherKey {


    constructor() {
        this.key = null;
    }
    ready() {
        return this.load()
            .then((key) => this.key)
            .catch(() => {
                return this.generate();
            });
    }
    load() {
        return new Promise(function(resolve, reject){
            const stored = localStorage.getItem('cypher-key');
            if ( stored !== null ) {
                resolve(stored);
            } else {
                reject(false);
            }
        });
    }
    generate(extractable=true) {
        return window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
            },
            extractable, //whether the key is extractable (i.e. can be used in exportKey)
            ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
        )
        .then(function(key){
            //returns a keypair object
            //console.log(key);
            //console.log(key.publicKey);
            //console.log(key.privateKey);
            return key;
        })
        .catch(function(error){
            console.error(error);
            return error;
        });   
    }

}
