const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }); // root is where we want to serve from
});

server.on('request', app);
server.listen(3000, () => console.log('Listening on 3000'));
