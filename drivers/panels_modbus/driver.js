'use strict';

import BaseDriver from '../baseMobusDriver';

class PanelsDriver extends BaseDriver {

  getName(data) {
    return 'Modbus Solarpanels';
  }

}

module.exports = PanelsDriver;
