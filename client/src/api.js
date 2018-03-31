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

const concat = (result, key, value) => {
    const join = (result.length > 0) ? '?' : '&';
    return `${join}${key}=${encodeURIComponent(value)}`;
};

function toURL(parameters){
    const parts = Object.entries(parameters);
    return parts.reduce((result, [key,value]) => concat(result, key, value),'');
}

export function get(parameters=null, endpoint=''){
    const urlParameters = toURL(parameters);
    const requestUrl = `${HOST}${endpoint}${urlParameters}`;
    return fetch(requestUrl, { 
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    });
}
