'use strict';

const { Driver } = require('homey');
const FLowHandler = require('../../lib/FlowHandler.js');

class KlevebrandSolarControllerDriver extends Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    const flowHandler = new FLowHandler();

    flowHandler.Init(this);

    this.log('Klevebrand Solar Controller driver has been initialized!');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    const deviceHandler = new DeviceHandler();

    this.log("Searching for device...");

    var deviceIp = await deviceHandler.discoverDevice();

    this.log(`Found device with ip address: ${deviceIp}`);

    return [
      {
        name: 'Klevebrand Solar Controller',
        data: {
          id: 'klevebrand-solar-controller'
        },
        store: {
          address: deviceIp
        }
      }
    ];
  }
}

module.exports = KlevebrandSolarControllerDriver;
