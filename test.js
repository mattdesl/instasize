const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const request = require('request-promise');
const middleware = require('./');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const remote = false;

test('error handling', async t => {
  const imageDataBuffer = await readFile(path.resolve(__dirname, './test-image.jpg'));
  const imageData = imageDataBuffer.toString('base64');

  let uri, service;
  if (remote) {
    uri = 'https://instasize-xpsrttrsvx.now.sh/';
  } else {
    service = micro(middleware);
    uri = await listen(service);
  }

  const body = await request({
    uri
  });
 
  t.deepEqual(body.includes('Error'), true);
  if (service) service.close();
});

test('my endpoint', async t => {
  const imageDataBuffer = await readFile(path.resolve(__dirname, './test-image.jpg'));
  const imageData = imageDataBuffer.toString('base64');

  let uri, service;
  if (remote) {
    uri = 'https://instasize-xpsrttrsvx.now.sh/';
  } else {
    service = micro(middleware);
    uri = await listen(service);
  }

  const body = await request({
    uri,
    encoding: null,
    body: imageData
  });
 
  const imageOut = Buffer.from(body);
  const imageExpected = await readFile('test-image-out.jpg');
  t.deepEqual(imageOut, imageExpected);
  if (service) service.close();
});
