import {send, get} from './api.js';

export class Account {
    constructor() {
        this.plate = '';
        this.cypherKey = new CypherKey();
        this.signerKey = new SignerKey();
    }
    load() {
        const plateLoad = new Promise((resolve, reject) => {
            const plate = localStorage.getItem('plate');
            if ( plate !== null ){ 
                this.plate = plate;
                resolve(plate);
            } else {
                const reason = 'no data found';
                reject({reason});
            }
        });
        return Promise.all([plateLoad,
                            this.cypherKey.load(), 
                            this.signerKey.load()]);
    }
    verify([plate, cypherKey, signerKey]) {
        console.log('verifying', plate);
        return get({plate}, 'users');
    }
    getKeys() {
        return {
            cypher: this.cypherKey,
            signer: this.signerKey,
        };
    }
    submitSubcription = ([publicCypher, publicSigner]) => {
        const subscription = {
            'plate': this.plate,
            'pub_key_cypher': publicCypher,
            'pub_key_signer': publicSigner
        };
        return send(subscription, 'users/me');
    }
    save = () => {
        localStorage.setItem('plate', this.plate);
        return Promise.all([this.cypherKey.save(), this.signerKey.save()]);
    }
    subscribe(plate) {
        this.plate = plate;
        const keysGeneration = Promise.all([
            this.cypherKey.generate(), 
            this.signerKey.generate()
        ]);
        const exportPublibKeys = ([cypher, signer]) => {
            return Promise.all([
                crypto.subtle.exportKey('jwk', cypher.publicKey),
                crypto.subtle.exportKey('jwk', signer.publicKey),
            ]);
        }
        const generateSubmitAndSave = new Promise((resolve, reject) => {
            return keysGeneration
                .then(exportPublibKeys)
                    .then(this.submitSubcription)
                        .then(this.save)
                            .then(resolve).catch(reject);
        });
        return generateSubmitAndSave;
    }
}

export class Key {
    constructor(denomination='unknown-key') {
        this.denomination = denomination;
        this.key = null;
    }
    ready() {
        return this.load()
            .then((key) => this.key)
            .catch(() => {
                return this.generate();
            });
    }
    load = () => {
        const key = this;
        return new Promise(function(resolve, reject){
            const stored = localStorage.getItem(key.denomination);
            if ( stored !== null ) {
                resolve(stored);
            } else {
                reject(false);
            }
        });
    }
    save = () => {
        const target = this.key.privateKey;
        return window.crypto.subtle.exportKey('jwk', target)
            .then((exportedKey) => {
                localStorage.setItem(this.denomination, exportedKey);
                console.log('saved key.', this.denomination, exportedKey);
                return exportedKey;
            });
    }
    generate(extractable=true) {
        throw Error('Not Implemented'); 
    }
    import(data){
        const provider = this;
        return window.crypto.subtle.import('jwk', data)
            .then((key) => { provider.key = key });
    }
}

export class CypherKey extends Key {
    constructor() {
        super('cypher-key');
    }
    generate(extractable=true) {
        const provider = this;
        return window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
            },
            extractable, 
            ["deriveKey", "deriveBits"] 
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

export class SignerKey extends Key {
    constructor() {
        super('signer-key');
    }
    generate(extractable=true) {
        const provider = this;
        return window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
            },
            extractable, 
            ["sign", "verify"] //can be any combination of "sign" and "verify"
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
