const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const { jparse } = require('../../helpers/util');

const getGlobalData = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const { start, end, interval } = eventBody;
    if(interval !== 'hourly' && interval !== 'daily') {
      throw { message: 'Interval not found', statusCode: 404 };
    }
    const data = await CoinDB("coin-global").getChartData(interval, start, end);
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

module.exports = { getGlobalData };