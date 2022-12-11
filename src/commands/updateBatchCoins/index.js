const { coinService } = require('../../services/coin.service');
const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const { timeout } = require('../../helpers/util');
const { ERRORS } = require('../../audit/constants');
const receipt = [];

const updateBatchCoins = async ({ eventBody, auditor }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  const body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const coinArr = [...coinIndex, ...stableCoins];
    const resp = await fetchData(coinArr);
    const dbResp = await storeData(resp);
    console.log(dbResp);
    body.message = "success";
  } catch (err) {
    console.log("Error => ", JSON.stringify(err));
    statusCode = 500;
    body.message = err.message;
  }
  return {
    statusCode,
    body,
    headers,
  };
}

const fetchData = async (coins) => {
  try {
    const resp = await coinService().fetchDetailedData(coins.join(","));
    return resp;
  } catch (err) {
    console.error(`**ERROR**: detailedCoinData => data fetch failed : ${JSON.stringify(err)}`);
    throw err;
  }
}

const storeData = async (coins) => {
  try {
    const coinDict = {};
    for(let item of coins) {
      coinDict[item.id] = {
        id: item.id,
        price: item.current_price,
        market_cap: item.market_cap,
        mc_24hr_change: item.market_cap_change_percentage_24h,
        price_24hr_change: item.price_change_percentage_24h,
        volume: item.total_volume
      };
    }
    const dbResp = await CoinDB(process.env.BATCH_COINS_TABLE).updateBatchCoins(coinDict);
    return dbResp;
  } catch (e) {
    console.error(`**ERROR**: store Detailed Data => DB operation failed : ${e.message}`);
    throw e;
  }
}

module.exports = { updateBatchCoins }