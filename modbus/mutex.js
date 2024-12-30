'use strict';

class Mutex {

  constructor() {
    this._locking = Promise.resolve();
    this._locks = 0;
  }

  isLocked() {
    return this._locks > 0;
  }

  lock() {
    this._locks += 1;

    let unlockNext;

    const willLock = new Promise((resolve) => {
      unlockNext = () => {
        this._locks -= 1;
        resolve();
      };
    });

    const willUnlock = this._locking.then(() => unlockNext);
    this._locking = this._locking.then(() => willLock);

    return willUnlock;
  }

}

module.exports = Mutex;
