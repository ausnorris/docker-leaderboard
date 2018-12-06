var http = require("http");
var ShareDB = require("sharedb");
var connect = require("connect");
var serveStatic = require('serve-static');
var ShareDBMingoMemory = require('sharedb-mingo-memory');
var WebSocketJSONStream = require('websocket-json-stream');
var WebSocket = require('ws');
var util = require('util');

// Start ShareDB
var share = ShareDB({db: new ShareDBMingoMemory()});

// Create a WebSocket server
var app = connect();
app.use(serveStatic('.'));
var server = http.createServer(app);
var wss = new WebSocket.Server({server: server});
server.listen(80);
console.log("Listening on http://localhost:8080");

// Connect any incoming WebSocket connection with ShareDB
wss.on('connection', function(ws, req) {
  var stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

// Create initial documents
var connection = share.connect();
connection.createFetchQuery('players', {}, {}, function(err, results) {
  if (err) { throw err; }

  if (results.length === 0) {
    var names = ['Scott "Roundhouse" Norris', 'Chris "Spicy" Slater', 'Grant "Angry" Orchard', 'none of the above'];

    names.forEach(function(name, index) {
      var doc = connection.get('players', ''+index);
      var data = {name: name, score: 0};
      doc.create(data);
    });
  }
});
