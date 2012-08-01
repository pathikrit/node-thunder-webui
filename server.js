///////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  target: {
    reset   : 'RESET',
    harvey  : 'r400,u80,f2',
    josh    : 'r1000,u180,f2',
    joel    : 'r1900,u190,f2',
    vassili : 'r2000,f2',
    winton  : 'r2400,u230,f2',
    mark    : 'r3000,u250,f2',
    lagrotta: 'r3900,u60,f2',
    rick    : 'r4600,u20,f2'
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
