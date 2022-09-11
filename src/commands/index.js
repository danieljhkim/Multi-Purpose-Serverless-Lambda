const { ACTIONS } = require('./actions');
const { putCoinData } = require('./putCoinData');

const commands = {
  [ACTIONS.WRITE_COINS_TO_DB]: putCoinData
}

module.exports = { commands };