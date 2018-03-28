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
        return this.cypherKey.generate()
            .then((keyPair) =>  {
                return crypto.subtle.exportKey('jwk', keyPair.publicKey)
                    .then(this.submitSubcription)
                        .then(this.cypherKey.save);
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
    save(keys) {
        localStorage.setItem('cypher-key', keys);
        console.log('saved keys.');
    }
    generate(extractable=true) {
        const provider = this;
        return window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
            },
            extractable, //whether the key is extractable (i.e. can be used in exportKey)
            ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
        )
        .then((key) => {
            provider.key = key;
            return key;
        })
        .catch(function(error){
            console.error(error);
            return error;
        });   
    }

}
