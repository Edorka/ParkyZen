const HOST = 'http://localhost:8080/';

export function send(data, endpoint='') {
  return fetch(HOST + endpoint, { 
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}

const concat = (previous, key, value) => {
    const join = (previous.length === 0) ? '?' : '&';
    return `${previous}${join}${key}=${encodeURIComponent(value)}`;
};

function toURL(parameters){
    const parts = Object.entries(parameters);
    return parts.reduce((result, [key,value]) => concat(result, key, value),'');
}

export function get(parameters=null, endpoint=''){
    const urlParameters = toURL(parameters);
    const requestUrl = `${HOST}${endpoint}${urlParameters}`;
    const request = new Promise((resolve, reject) => {
        const decideByStatus = (res) => {
            if ( 199 < res.status && 300 > res.status ) {
                resolve(res);
            } else {
                reject(res);
            }
        };
        fetch(requestUrl, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(decideByStatus).catch(reject);
    });
    return request;
}

export class MessageInput {
    constructor(account) {
        this.account = account;
        this.subscribers = []; 
        this.index = 0;
        this.plate = account.plate;
    }
    setIndex(index) {
        this.index = index;
    }
    load() {
        const provider = this;
        const subscribers = this.subscribers;
        return get({'plate': this.plate, 'from_index': this.index}, 'messages')
            .then(res => res.json())
                .then((result) => {
                    subscribers.forEach((subscriber) => subscriber(result));
                    provider.start();
                });
    }
    feed(callback) {
        this.subscribers.push(callback);
    }
    start(delay=500) {
        let income = this;
        this.timeout = window.setTimeout(()=>{
            income.load();
        }, delay);
    }
}

export class MessageOutput {
    constructor(account) {
        this.account = account;
    }
    send(content='', recipient=null) {
        const message = {
            'to': recipient,
            'content': content,
            'from': this.account.plate,
        };
        return send({ ...message }, 'messages');
    }
}
