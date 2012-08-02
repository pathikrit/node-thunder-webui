///////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  target: {
    reset   : 'RESET',
    harvey  : 'r400,u150,f4',
    josh    : 'r1000,u300,f4',
    joel    : 'r1900,u350,f4',
    vassili : 'r2000,f4',
    winton  : 'r2400,u330,f4',
    mark    : 'r3000,u350,f4',
    lagrotta: 'r3850,u90,f4',
    rick    : 'r4600,u60,f4'
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

var express = require('express'), server = express.createServer(
    express['static'](__dirname + '/public'),
    express.bodyParser()
);

server.get('/targets', function (req, res) {
  res.json(config.target);
});

server.post('/execute', function (req, res) {
  var cmd = req.body.cmd;

  var redirect = function () {
    res.redirect('/');
  };

  var callback = cmd === config.target.reset ? redirect : function () {
    console.log('Execute: ' + cmd);
    launcher.execute(cmd, redirect);
  };

  launcher.park(callback);
});

server.post('/control', function (req, res) {
  console.log('Control: ' + req.body.cmd);
  launcher[req.body.cmd]();
  res.redirect('/');
});

launcher.park(function () {
  console.log('Starting web server on port ' + config.server.port + ' ...');
  server.listen(config.server.port);
});
