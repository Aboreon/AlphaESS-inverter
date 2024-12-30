'use strict';

const Homey = require('homey');
const axios = require('axios');
const generateHash = require('./generateHash');

class BaseDriver extends Homey.Driver {

  getName(data) {
    return data.minv;
  }

  async onPairListDevices(data) {
    try {
      const devices = await this.fetchinvdata();
      this.log('onPairListDevices', devices);

      // Map API response to Homey device objects
      return devices
        ? devices.map((device) => {
          return {
            name: this.getName(device),
            data: {
              id: device.sysSn,
              // eslint-disable-next-line node/no-unsupported-features/es-syntax
              ...device,
            },
            settings: {
              sysSn: device.sysSn,
            },
          };
        })
        : null;
    } catch (error) {
      this.log('Failed to list devices:', error);
      throw new Error('Failed to list devices');
    }
  }

  async fetchinvdata() {
    const appId = this.homey.settings.get('appId');
    const appSecret = this.homey.settings.get('appSecret');
    const timeStamp = Math.floor(Date.now() / 1000);

    const sign = generateHash(appId, appSecret, timeStamp);

    try {
      const response = await axios.get(
        'https://openapi.alphaess.com/api/getEssList',
        {
          headers: {
            appId,
            timeStamp,
            sign,
          },
        },
      );

      return response.data?.data;
    } catch (error) {
      this.error('Failed to fetch data:', error);
    }

    return null;
  }

}

module.exports = BaseDriver;
