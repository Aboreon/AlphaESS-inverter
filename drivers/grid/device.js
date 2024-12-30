'use strict';

import BaseDevice from '../baseDevice';

class GridDevice extends BaseDevice {

  async setCapabilities(data) {
    await Promise.all([
      this.setCapabilityValue('measure_power.load', data.pload),
      this.setCapabilityValue('measure_power', data.pgrid),

      this.setCapabilityValue('measure_power.L1', data.pgridDetail.pmeterL1),
      this.setCapabilityValue('measure_power.L2', data.pgridDetail.pmeterL2),
      this.setCapabilityValue('measure_power.L3', data.pgridDetail.pmeterL3),

      this.setCapabilityValue('measure_power.imported', data.pgrid > 0 ? data.pgrid : 0),
      this.setCapabilityValue('measure_power.exported', data.pgrid < 0 ? data.pgrid * -1 : 0),
    ]);
  }

}

module.exports = GridDevice;
