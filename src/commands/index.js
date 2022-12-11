const { ACTIONS } = require('./actions');
const { putHourlyData } = require('./putHourlyData');
const { putGlobalCoinData } = require('./putGlobalData');
const { getCoinData } = require('./getCoinData');
const { getGlobalData } = require('./getGlobalData');
const { storeChart } = require('./storeChart');
const { getCharts } = require('./getCharts');
const { updateBatchCoins } = require('./updateBatchCoins');
const { getBatchCoins } = require('./getBatchCoins');

const commands = {
  [ACTIONS.WRITE_COINS_GLOBAL_TO_DB]: putGlobalCoinData,
  [ACTIONS.WRITE_COINS_HOURLY_TO_DB]: putHourlyData,
  [ACTIONS.GET_COINS_DB]: getCoinData,
  [ACTIONS.GET_GLOBAL_DB]: getGlobalData,
  [ACTIONS.STORE_COIN_CHARTS]: storeChart,
  [ACTIONS.GET_COIN_CHARTS]: getCharts,
  [ACTIONS.UPDATE_BATCH_COINS]: updateBatchCoins,
  [ACTIONS.GET_BATCH_COINS]: getBatchCoins,
}

module.exports = { commands };