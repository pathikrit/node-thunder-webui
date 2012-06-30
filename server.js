///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var config = {

  // Define launch sequences here (u)p, (d)own, (l)eft, (r)ight, (f)ire,
  // The numbers after u,d,l,r represents ms to do that action.
  // The number after fire represents number of missiles to fire
  target: {
    test   : 'l1000,r1100,u1200,d1300',
    vassili: 'u1,l1',
    rick   : 'u1,l1'
  },

  // Define web server configs here
  server: {
    port: 8080
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.log('Acquiring rocket launcher ...');
var launcher = require('node-thunder-driver');
if (config.target.test) {
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
  launcher.execute(req.body.cmd, function () {
    launcher.reset();
    res.redirect('back');
  });
});

server.listen(port);

