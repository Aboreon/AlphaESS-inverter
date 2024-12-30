'use strict';

const Homey = require('homey');
const Mutex = require('../modbus/mutex');
const ModbusEventEmitter = require('../modbus/emitter');

const EMITTERS = {};
const mutex = new Mutex();

async function getInstance(name, construct) {
  const unlock = await mutex.lock();
  try {
    let inst = EMITTERS[name];
    if (inst) {
      inst.count += 1;
      return inst.instance;
    }

    inst = construct();

    EMITTERS[name] = {
      count: 1,
      instance: inst,
    };

    return inst;
  } finally {
    unlock();
  }
}

async function destroyInstance(name) {
  const unlock = await mutex.lock();
  try {
    const inst = EMITTERS[name];
    inst.count -= 1;

    if (inst === 0) {
      inst.stop();
      delete EMITTERS[name];
    }
  } finally {
    unlock();
  }
}

class ModbusBaseDevice extends Homey.Device {

  emitter = null;
  errorEmitter;
  dataEmitter;

  async onInit() {
    this.log('Device has been initialized');
    await this.startPolling();
  }

  async onSettings(/* { oldSettings, newSettings, changedKeys } */) {
    await this.startPolling();
  }

  async cleanup() {
    // Clear any existing intervals
    if (this.emitter) {
      this.emitter.off('error', this.errorEmitter);
      this.emitter.off('data', this.dataEmitter);

      await destroyInstance(this.emitter.id());

      this.emitter = null;
    }
  }

  async startPolling() {
    await this.cleanup();

    const host = (this.getSetting('hostname') || this.homey.settings.get('hostname')).toLowerCase();
    const port = this.getSetting('port') || this.homey.settings.get('port');

    let interval = parseInt(this.getSetting('interval'), 10) || 10;
    if (Number.isNaN(interval) || interval <= 1) {
      interval = 1;
    }

    const emitterName = `${host}:${port}`;
    this.emitter = await getInstance(emitterName, () => new ModbusEventEmitter(host, port));

    this.errorEmitter = (e) => {
      this.error(e);
    };

    this.dataEmitter = async (data) => {
      // this.log(data);
      this.log('Received data');
      await this.setCapabilities(data);
    };

    this.emitter.on('error', this.errorEmitter);
    this.emitter.on('data', this.dataEmitter);

    // this is done multiple times
    this.emitter.start(interval * 1000);
  }

  // eslint-disable-next-line no-empty-function
  async setCapabilities(data) { }

  onDeleted() {
    this.log('Device has been deleted');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.cleanup();
  }

}

module.exports = ModbusBaseDevice;
