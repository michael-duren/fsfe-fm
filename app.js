const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }); // root is where we want to serve from
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on 3000'));

/** Begin Websockets using ws (npm i ws) */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server }); // server is the http server we created above

// web socket has this idea of states
// the minute someone connects to our server
wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Clients connected', numClients);

  // broadcast command it will send a server message to all clients
  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to cyber chat');
  }

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client has disconnected');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};
