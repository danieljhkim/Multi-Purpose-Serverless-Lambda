const { coinService } = require('../../services/coin.service');
const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const { timeout } = require('../../helpers/util');
const { ERRORS } = require('../../audit/constants');
const receipt = [];

const putHourlyData = async ({ eventBody, auditor }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  const body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const coinArr = [...coinIndex, ...stableCoins];
    const coinsToLog = eventBody.coins || coinArr;
    const days = eventBody.days;
    for(let i=0; i<coinsToLog.length; i++) {
      let coin = coinsToLog[i];
      await fetchStoreData(coin, days, auditor);
    }
    body.receipt = receipt;
  } catch (err) {
    console.log("Error => ", JSON.stringify(err));
    statusCode = 500;
    body.message = err.message;
    const auditContent = {
      fileName: ERRORS.PUT_HOURLY_DATA,
      body: {
        message: err.message,
      }
    }
    auditor.pushAudit(auditContent);
  }
  return {
    statusCode,
    body,
    headers,
  };
}

const fetchStoreData = async (coin, days, auditor) => {
  // if days > 90 then interval == daily
  try {
    const resp = await coinService().getMarketChart(coin, days);
    const statusCode = await storeData(resp, coin, auditor);
    receipt.push({coin, statusCode});
  } catch (err) {
    console.error(`**ERROR**: ${coin} => data fetch failed : ${JSON.stringify(err)}`);
    receipt.push({coin, statusCode: 500});
    const auditContent = {
      fileName: ERRORS.DB_ERROR_PUT_COIN,
      body: {
        message: err.message,
        coin: coin
      }
    }
    auditor.pushAudit(auditContent);
  }
}

const storeData = async (resp, coin, auditor) => {
  try {
    const prices = resp['prices'];
    const volumns = resp['total_volumes'];
    const mc = resp['market_caps'];
    for(let i=0; i<prices.length; i++) {
      const price = prices[i];
      const volumn = volumns[i];
      const marketCap = mc[i];
      if(price[0] !== volumn[0]) { 
        const auditContent = {
          fileName: ERRORS.VOL_TIME_MISMATCH,
          body: {
            message: "Volme timestamp mismatch",
            coin: coin
          }
        }
        auditor.pushAudit(auditContent);
        console.error(`**ERROR**: ${coin} => volume timestamp mismatch: ${volumn}`);
      }
      if(price[0] !== marketCap[0]) {
        const auditContent = {
          fileName: ERRORS.MC_TIME_MISMATCH,
          body: {
            message: "MC timestamp mismatch",
            coin: coin
          }
        }
        auditor.pushAudit(auditContent);
        console.error(`**ERROR**: ${coin} => mc timestamp mismatch: ${marketCap}`);
      }
      const db = await CoinDB(process.env['COIN_HOURLY_TABLE']).putChartData(coin, price[0], price[1], marketCap[1], volumn[1]);
      //console.log(coin + "=> DB operation success. timestamp: " + price[0]);
      await timeout(1000);
    }
    return 200;
  } catch (e) {
    console.error(`**ERROR**: ${coin} => DB operation failed : ${e.message}`);
    const auditContent = {
      fileName: ERRORS.PUT_HOURLY_DATA,
      body: {
        message: e.message,
        coin: coin
      }
    }
    auditor.pushAudit(auditContent);
    return 500;
  }
}

module.exports = { putHourlyData }