'use strict';

import BaseDriver from '../baseMobusDriver';

class GridDriver extends BaseDriver {

  getName(data) {
    return 'Grid Modbus Meter';
  }

}

module.exports = GridDriver;
