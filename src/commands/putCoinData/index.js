const { coinService } = require('../services/coin.service');
const { genericValidator } = require('../validator');
const { coinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinList, rCoins, stableCoins, dbCoins } = require('./constants')

const putCoinData = async ({ event }) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const body = {};
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    let [totalMC, totalVol, stableMC, stableVol, rMC, rVol, dateTime] = [0, 0, 0, 0, 0, 0, ""];
    const respData = await coinService().getCoinData(coinList)
    body.status = [];
    let i = 0;
    for(let obj in respData) {
      let name = Object.keys(respData)[i++];
      let data = respData[name];
      if(stableCoins.includes(name)) {
        stableMC +=  data.usd_market_cap;
        stableVol += data.usd_24h_vol;
      } else {
        rMC +=  data.usd_market_cap;
        rVol += data.usd_24h_vol;
      }
      totalMC += data.usd_market_cap;
      totalVol += data.usd_24h_vol;
      dateTime = data.last_updated_at.toString();
      if(dbCoins.includes(name)) {
        let db = await putData(name, data.last_updated_at.toString(), data.usd, data.usd_market_cap, data.usd_24h_vol);  //FIXME: 
        if(db?.$response?.error === null) {
          console.log(`DB update success => ${JSON.stringify(db)}`);
          body.status.push(`${name} => success`);
        } else {
          body.status.push(`${name} => failed`);
        }
      }
    }
    const db = await coinDB().putGlobalData(stableMc, stableVol, rMc, rVol, totalMc, totalVol); //FIXME: 
  } catch (err) {
    statusCode = '500';
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  return {
    statusCode,
    body,
    headers,
  };
}

module.exports = { putCoinData }