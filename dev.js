const micro = require('micro');
const listen = require('test-listen');
const request = require('request-promise');
const middleware = require('./');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const getIP = require('internal-ip');

const start = async () => {
  const service = micro(middleware);
  const port = 3000;
  await service.listen(port);
  const ip = await getIP.v4();
  console.log(`http://${ip}:${port}/`);
};

start();