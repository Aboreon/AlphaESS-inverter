'use strict';

import BaseDevice from '../baseModbusDevice';

function formatBit(b) {
  if (!b || b === '') return '-';
  return b;
}

class GridDevice extends BaseDevice {

  flowTrigger;

  async onInit() {
    await super.onInit();
    this.flowTrigger = this.homey.flow.getTriggerCard('alpha_state_changed');
  }

  async setCapabilities(data) {
    // const pv = data['0x41F'].value
    //   + data['0x423'].value
    //   + data['0x427'].value
    //   + data['0x429'].value;

    const grid = data['0x21'].value;
    const inverter = data['0x40C'].value;
    const battery = data['0x126'].value;

    let load = 0;

    // battery discharging
    if (battery > 0) {
      load = battery + grid;
    } else {
      load = inverter + grid;
    }

    this.log('grid;', grid, 'inverter:', inverter, 'battery:', battery, 'load:', load);

    const oldState = this.getCapabilityValue('alpha_state');
    const newState = `${data['0x440'].value}`;

    await Promise.all([
      this.setCapabilityValue('measure_power', grid),
      this.setCapabilityValue('measure_power.load', load),

      this.setCapabilityValue('measure_power.L1', data['0x1B'].value),
      this.setCapabilityValue('measure_power.L2', data['0x1D'].value),
      this.setCapabilityValue('measure_power.L3', data['0x1F'].value),

      this.setCapabilityValue('measure_power.imported', grid >= 0 ? grid : 0),
      this.setCapabilityValue('measure_power.exported', grid < 0 ? grid * -1 : 0),

      this.setCapabilityValue('alpha_state', newState),

      this.setCapabilityValue('alarm_power', newState === 2 || newState === 3),
      this.setCapabilityValue('alarm_generic', newState === 4),

      this.setCapabilityValue('alpha_fault_text.fault1', formatBit(data['0x43A'].value_string)),
      this.setCapabilityValue('alpha_fault_text.fault2', formatBit(data['0x43C'].value_string)),
      this.setCapabilityValue('alpha_fault_text.extended1', formatBit(data['0x44B'].value_string)),
      this.setCapabilityValue('alpha_fault_text.extended2', formatBit(data['0x44D'].value_string)),

      this.setCapabilityValue('meter_power.exported', data['0x10'].value),
      this.setCapabilityValue('meter_power.imported', data['0x12'].value),
    ]);

    if (oldState !== newState) {
      this.log('Triggering alpha_state_changed');
      await this.flowTrigger.trigger({
        alpha_state: data['0x440'].value_name,
      });
    }
  }

}

module.exports = GridDevice;
