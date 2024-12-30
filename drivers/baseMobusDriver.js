'use strict';

const Homey = require('homey');
const Reader = require('../modbus/reader');

class BaseDriver extends Homey.Driver {

  getName(data) {
    return data['0x64A'].value;
  }

  async onPairListDevices(data) {
    try {
      const device = await this.fetchinvdata();
      this.log('onPairListDevices', device);

      // Map API response to Homey device objects
      return [
        {
          name: this.getName(device),
          data: {
            id: device['0x64A'].value,
          },
          settings: {
            hostname: this.homey.settings.get('hostname'),
            port: this.homey.settings.get('port'),
          },
        },
      ];
    } catch (error) {
      this.log('Failed to list devices:', error);
      throw new Error('Failed to list devices');
    }
  }

  async fetchinvdata() {
    const host = this.homey.settings.get('hostname');
    const port = this.homey.settings.get('port');

    this.log('Connecting to', host, port);

    try {
      const reader = new Reader(host, port);
      return await reader.readOnce();
    } catch (error) {
      this.error('Failed to fetch data:', error);
    }

    return null;
  }

}

module.exports = BaseDriver;
