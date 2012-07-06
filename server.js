///////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  target: {
    test: 'l1000,r1000,u1000,d1000',
    reset: 'd1000,l8000',
    vassili: 'u500,l500',
    rick: 'r500,d500'
  },

  // Define web server configs here
  server: {
    port: 8080
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

console.log('Acquiring rocket launcher ...');
var launcher = require('node-thunder-driver');

console.log('Starting web server on port ' + config.server.port + ' ...');

var express = require('express'), server = express.createServer(
    express['static'](__dirname + '/public'),
    express.bodyParser()
);

server.get('/targets', function (req, res) {
  res.json(config.target);
});

server.post('/execute', function (req, res) {
  console.log('Execute: ' + req.body.cmd);
  launcher.execute(req.body.cmd, function () {
    res.redirect('/');
  });
});

server.post('/control', function (req, res) {
  console.log('Control: ' + req.body.cmd);
  launcher[req.body.cmd].call(this);
  res.redirect('/');
});

server.listen(config.server.port);
