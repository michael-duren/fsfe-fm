const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }); // root is where we want to serve from
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on 3000'));

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down server');
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {});

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    process.exit(0);
  });
});

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
    ws.send(`Welcome to cyber chat you are user number: ${numClients}`);
  }

  db.run(`INSERT INTO visitors (count, time) 
      VALUES (${numClients}, datetime('now'))
  `);

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

/** End Web Sockets */
/** Begin database */
/** Database stuff **/

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// .seralize ensures DB is set up before any queries
db.serialize(() => {
  db.run(`CREATE TABLE visitors (
      count INTEGER,
      time TEXT
      )`);
});

function getCounts() {
  db.each('SELECT * FROM visitors', (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log('shutting down DB');
  db.close();
}
