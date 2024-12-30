'use strict';

import BaseDriver from '../baseMobusDriver';

class BatteryDriver extends BaseDriver {

  getName(data) {
    return data['0x11A'].value_name || 'Battery';
  }

}

module.exports = BatteryDriver;
