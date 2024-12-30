'use strict';

const crypto = require('crypto');

function generateHash(appId, appSecret, timestamp) {
  const data = `${appId}${appSecret}${timestamp}`;
  // Create a SHA-512 hash
  const hash = crypto.createHash('sha512').update(data).digest('hex');
  return hash;
}

module.exports = generateHash;
