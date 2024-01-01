const TrestSolarModule = require('./modules/TrestSolarModule.js');

class SolarModule {
    async Init(args) {
        var trestSolarModule = new TrestSolarModule();

        // Call httpGetSolarHistory immediately when the device is initialized
        await trestSolarModule.authenticate(args);

        // Set up an interval to call httpGetSolarHistory every 30 seconds
        this.solarHistoryInterval = setInterval(async () => {
            try {
                let solarHistory = await trestSolarModule.getSolarHistory(args);

                args.log(solarHistory);

                this.setSolarHistoryCapabilites(args, solarHistory);

                args.log("Updated battery status");
            } catch (error) {
                args.error('Failed to fetch solar history:', error);
            }
        }, 5000);
    }

    async InitButtons(args) {
        var trestSolarModule = new TrestSolarModule();

        args.registerCapabilityListener('sell_button', trestSolarModule.setEnergyMode.bind(args, 5));
        args.registerCapabilityListener('buy_button', trestSolarModule.setEnergyMode.bind(args, 4));
        args.registerCapabilityListener('self_sufficient_button', trestSolarModule.setEnergyMode.bind(args, 1));
        args.registerCapabilityListener('pause_button', trestSolarModule.setEnergyMode.bind(args, 6));
    }

    setSolarHistoryCapabilites(args, jsonData) {
        args.setCapabilityValue('real_time_solar', jsonData.realtimeSolar);
        args.setCapabilityValue('measure_battery', parseInt(jsonData.batteryCapacity));
        args.setCapabilityValue('total_load_active_power', jsonData.totalLoadActivePower);
        args.setCapabilityValue('battery_charging', parseFloat(parseFloat(jsonData.batteryCharge.slice(0, -2)) - parseFloat(jsonData.batteryDischarge.slice(0, -2))) + "kWh");
    }
}

module.exports = SolarModule;