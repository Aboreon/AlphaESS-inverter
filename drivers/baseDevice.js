'use strict';

const Homey = require('homey');
const axios = require('axios');
const generateHash = require('./generateHash');

class BaseDevice extends Homey.Device {

  async onInit() {
    this.log('Device has been initialized');
    this.startPolling();
  }

  async onSettings(/* { oldSettings, newSettings, changedKeys } */) {
    this.startPolling();
  }

  startPolling() {
    // Clear any existing intervals
    if (this.pollingTask) this.homey.clearInterval(this.pollingTask);

    const refreshInterval = this.getSetting('interval') < 10
      ? 10 // refresh interval in seconds minimum 10
      : this.getSetting('interval');

    // Set up a new interval
    this.pollingTask = this.homey.setInterval(this.fetchData.bind(this), refreshInterval * 1000);
  }

  // eslint-disable-next-line no-empty-function
  async setCapabilities(data) { }

  async fetchData() {
    const appId = this.homey.settings.get('appId');
    const appSecret = this.homey.settings.get('appSecret');
    const sysSn = this.getSetting('sysSn');

    if (!appId || !appSecret || !sysSn) {
      this.log('Missing configuration: appId, appSecret, or sysSn');
      return;
    }

    const timeStamp = Math.floor(Date.now() / 1000);
    const sign = generateHash(appId, appSecret, timeStamp);

    try {
      const response = await axios.get(
        `https://openapi.alphaess.com/api/getLastPowerData?sysSn=${sysSn}`,
        {
          headers: {
            appId,
            timeStamp,
            sign,
          },
        },
      );

      this.log('Fetched', response.data);
      await this.setCapabilities(response.data?.data);
    } catch (error) {
      this.error('Failed to fetch data:', error);
    }
  }

  onDeleted() {
    this.log('Device has been deleted');

    // Clear the interval when the device is deleted
    this.homey.clearInterval(this.pollingTask);
  }

}

module.exports = BaseDevice;
