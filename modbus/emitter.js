'use strict';

const events = require('events');
const Reader = require('./reader');

const INTERVAL = 10 * 1000;

class ModbusEventEmitter extends events.EventEmitter {

  reader = null;
  pollingTask = null;

  constructor(host, port) {
    super();
    this.reader = new Reader(host, port);
  }

  id() {
    return `${this.reader.host}:${this.reader.port}`;
  }

  stop() {
    clearInterval(this.pollingTask);
  }

  start(interval = INTERVAL) {
    if (this.pollingTask) {
      this.stop();
    }

    // eslint-disable-next-line homey-app/global-timers, @typescript-eslint/no-misused-promises
    this.pollingTask = setInterval(() => this.poll(), interval);
  }

  async poll() {
    try {
      const result = await this.reader.readOnce();
      this.emit('data', result);
    } catch (e) {
      this.emit('error', e);
    }
  }

}

module.exports = ModbusEventEmitter;
