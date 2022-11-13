const { ACTIONS } = require('./actions');
const { putHourlyData } = require('./putHourlyData');
const { putGlobalCoinData } = require('./putGlobalData');
const { getCoinData } = require('./getCoinData');
const { getGlobalData } = require('./getGlobalData');

const commands = {
  [ACTIONS.WRITE_COINS_GLOBAL_TO_DB]: putGlobalCoinData,
  [ACTIONS.WRITE_COINS_HOURLY_TO_DB]: putHourlyData,
  [ACTIONS.GET_COINS_DB]: getCoinData,
  [ACTIONS.GET_GLOBAL_DB]: getGlobalData
}

module.exports = { commands };