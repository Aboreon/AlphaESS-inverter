'use strict';

import BaseDevice from '../baseDevice';

class BatteryDevice extends BaseDevice {

  async setCapabilities(data) {
    await Promise.all([
      this.setCapabilityValue('measure_battery', data.soc),
      this.setCapabilityValue('measure_power', data.pbat * -1),
    ]);
  }

}

module.exports = BatteryDevice;
