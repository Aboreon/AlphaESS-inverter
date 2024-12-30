'use strict';

import BaseDriver from '../baseDriver';

class BatteryDriver extends BaseDriver {

  getName(data) {
    return data.mbat;
  }

}

module.exports = BatteryDriver;
