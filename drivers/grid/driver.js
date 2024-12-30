'use strict';

import BaseDriver from '../baseDriver';

class GridDriver extends BaseDriver {

  getName(data) {
    return 'Grid Meter';
  }

}

module.exports = GridDriver;
