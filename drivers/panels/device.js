'use strict';

import BaseDevice from '../baseDevice';

class PanelDevice extends BaseDevice {

  async setCapabilities(data) {
    await Promise.all([
      this.setCapabilityValue('measure_power', data.ppv),

      this.setCapabilityValue('measure_power.ppv1', data.ppvDetail.ppv1),
      this.setCapabilityValue('measure_power.ppv2', data.ppvDetail.ppv2),
      this.setCapabilityValue('measure_power.ppv3', data.ppvDetail.ppv3),
      this.setCapabilityValue('measure_power.ppv4', data.ppvDetail.ppv4),
    ]);
  }

}

module.exports = PanelDevice;
