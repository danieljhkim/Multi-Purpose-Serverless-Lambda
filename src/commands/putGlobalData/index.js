const { coinService } = require('../../services/coin.service');
const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { coinList, stableCoins } = require('../../helpers/constants')

const putGlobalCoinData = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {
    status: "success"
  };
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const interval = eventBody["interval"] || 'hourly';
    let [stableMC,stableVol,unstableMC,unstableVol,datetime] =[0, 0, 0, 0, Math.floor(Date.now() / 1000)];
    const unStableResp = await coinService().getCoinData(coinList);
    const unstables = Object.keys(unStableResp).map(key => unStableResp[key]);
    if(Array.isArray(unstables)) {
      for(let i=0; i<unstables.length; i++) {
        unstableMC += unstables[i]['usd_market_cap'];
        unstableVol += unstables[i]['usd_24h_vol'];
      }
    }
    const stableResp = await coinService().getCoinData(stableCoins.join());
    const stables = Object.keys(stableResp).map(key => stableResp[key]);
    if(Array.isArray(stables)) {
      for(let i=0; i<stables.length; i++) {
        stableMC += stables[i]['usd_market_cap'];
        stableVol += stables[i]['usd_24h_vol'];
      }
    }
    stableMC = Math.floor(stableMC);
    unstableMC = Math.floor(unstableMC);
    stableVol = Math.floor(stableVol);
    unstableVol = Math.floor(unstableVol);
    const db = await CoinDB("coin-global").putGlobalData(interval, datetime, stableMC, unstableMC, stableVol, unstableVol);
    if(db['$response'].error) {
      body.status = "failed";
    }
  } catch (err) {
    statusCode = 500;
    body.status = "failed";
    body.message = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  return {
    statusCode,
    body,
    headers
  };
}

module.exports = { putGlobalCoinData }