Web UI for USB Missile Launcher

Examine config section of server.js

npm install; node server.js and open http://localhost:port in your browser

Note: To work in Mac, replace the line:

   "node-thunder-driver": "git://github.com/pathikrit/node-thunder-driver.git"

in package.json with:

   "node-thunder-driver": "git://github.com/pathikrit/node-thunder-driver.git#gcc4.2_compat"
