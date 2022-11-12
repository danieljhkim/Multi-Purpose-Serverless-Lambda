const { ACTIONS } = require('./actions');
const { putHourlyData } = require('./putHourlyData');
const { putGlobalCoinData } = require('./putGlobalData');

const commands = {
  [ACTIONS.WRITE_COINS_GLOBAL_TO_DB]: putGlobalCoinData,
  [ACTIONS.WRITE_COINS_HOURLY_TO_DB]: putHourlyData
}

module.exports = { commands };