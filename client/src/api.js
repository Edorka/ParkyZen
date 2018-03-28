const HOST = 'http://localhost:8080/';

export function send(data, endpoint='') {
  console.log('data', data);
  return fetch(HOST + endpoint, { 
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}
