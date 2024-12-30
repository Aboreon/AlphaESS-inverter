'use strict';

import BaseDevice from '../baseModbusDevice';

class PanelDevice extends BaseDevice {

  async onInit() {
    await super.onInit();
  }

  async setCapabilities(data) {
    const total = data['0x41F'].value
      + data['0x423'].value
      + data['0x427'].value
      + data['0x429'].value;

    await Promise.all([
      this.setCapabilityValue('measure_power', total),

      this.setCapabilityValue('measure_power.ppv1', data['0x41F'].value),
      this.setCapabilityValue('measure_power.ppv2', data['0x423'].value),
      this.setCapabilityValue('measure_power.ppv3', data['0x427'].value),
      this.setCapabilityValue('measure_power.ppv4', data['0x429'].value),

      this.setCapabilityValue('measure_temperature', data['0x435'].value),

      this.setCapabilityValue('meter_power', data['0x43E'].value),
    ]);
  }

}

module.exports = PanelDevice;
