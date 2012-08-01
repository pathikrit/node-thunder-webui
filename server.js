///////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  target: {
    reset   : 'RESET',
    harvey  : 'u50,r200',
    josh    : 'u100,r1000',
    joel    : 'u50,r1800',
    vassili : 'r2000',
    winton  : 'r2300,u20',
    mark    : 'r3000,u20',
    lagrotta: 'r3800,u20',
    rick    : 'r5000,u20'
  },

  // Define web server configs here
  server: {
    port: 8080
  },

  auto_reset_interval: 60 * 1000
};

///////////////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

var parked;

console.log('Acquiring rocket launcher ...');
var launcher = require('node-thunder-driver');

var express = require('express'), server = express.createServer(
    express['static'](__dirname + '/public'),
    express.bodyParser()
);

function park(callback) {
  if (parked) {
    if (callback) {
      callback();
    }
  } else {
    console.log("Parking ...");
    parked = true;
    launcher.park(callback);
  }
}

server.get('/targets', function (req, res) {
  res.json(config.target);
});

server.post('/execute', function (req, res) {
  var cmd = req.body.cmd, redirect = function () {
    res.redirect('/');
  };
  if (cmd === config.target.reset) {
    park(redirect);
  } else {
    park(function () {
      parked = false;
      console.log('Execute: ' + cmd);
      launcher.execute(cmd, redirect);
    });
  }
});

server.post('/control', function (req, res) {
  parked = false;
  console.log('Control: ' + req.body.cmd);
  launcher[req.body.cmd]();
  res.redirect('/');
});

park(function () {
  console.log('Starting web server on port ' + config.server.port + ' ...');
  server.listen(config.server.port);
});

setInterval(park, config.auto_reset_interval);
