const { ACTIONS } = require('./actions');
const { putHourlyData } = require('./putHourlyData');
const { putGlobalData } = require('./putGlobalData');

const commands = {
  [ACTIONS.WRITE_COINS_GLOBAL_TO_DB]: putGlobalData,
  [ACTIONS.WRITE_COINS_HOURLY_TO_DB]: putHourlyData
}

module.exports = { commands };