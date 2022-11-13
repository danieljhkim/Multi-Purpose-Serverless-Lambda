const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const { jparse } = require('../../helpers/util');

const getCoinData = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const ALL_COINS = [...coinIndex, ...stableCoins];
    const { start, end, coin, table } = eventBody;
    if(!ALL_COINS.includes(coin)) {
      throw { message: 'Coin not found', statusCode: 404 };
    }
    const data = await CoinDB(table).getChartData(coin, start, end);
    body.data = data;
  } catch (err) {
    err = jparse(err);
    statusCode = err.statusCode || 500;
    body.message = err.message;
  }
  return {
    statusCode,
    body,
    headers
  };
}

module.exports = { getCoinData };