const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { jparse } = require('../../helpers/util');

const getBatchCoins = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const data = await CoinDB(process.env.BATCH_COINS_TABLE).getBatchCoins("latest");
    body.body = data;
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

module.exports = { getBatchCoins };