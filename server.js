///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  target: {
    test   : 'l1000 r1100 u1200 d1300',
    vassili: 'u1 l1',
    rick   : 'u1 l1'
  },

  // Define web server configs here
  server: {
    port: 8080
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

console.log('Acquiring rocket launcher ...');
var launcher = require('node-thunder-driver');
if (launcher && config.target.test) {
  console.log('Executing launcher test sequence ...');
  launcher.execute(config.target.test, function () {
    console.log('Launcher online!');
  });
}

var port = config.server.port;
console.log('Starting web server on port ' + port + ' ...');

var express = require('express'), server = express.createServer(
  express['static'](__dirname + '/public'),
  express.bodyParser()
);

server.get('/targets', function (req, res) {
  res.json(config.target);
});

server.post('/execute', function (req, res) {
  console.log('Executing: ' + req.body.cmd);
  res.redirect('/');
//  launcher.execute(req.body.cmd, function() {
//    launcher.reset(function() {
//      res.redirect('/');
//    });
//  });
});

server.post('/control', function (req, res) {
  console.log('Control: ' + req.body.cmd);
  //launcher[req.body.cmd].call(-1);
  res.redirect('/');
});

server.listen(port);

