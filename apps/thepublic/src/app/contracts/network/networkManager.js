const os = require('os');

let networkManager;
if (os.platform() === 'win32') {
  networkManager = require('./networkManagerWindows');
} else {
  networkManager = require('./networkManagerUnix');
}

module.exports = networkManager;