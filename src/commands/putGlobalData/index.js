const { coinService } = require('../../services/coin.service');
const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { timeout } = require('../../helpers/util');
const { coinList, stableCoins } = require('../../helpers/constants');

const putGlobalCoinData = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {
    globalStatus: "success",
    CSDReceipts: []
  };
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const interval = eventBody["interval"] || 'hourly';
    const CSD_TABLE = interval === 'hourly' ? process.env['CSD_HOURLY_TABLE'] : process.env['CSD_DAILY_TABLE'];

    //---------------- globals ------------------ //
    const datetime = Math.floor(Date.now() / 1000);
    let data = null;
    while(true) {
      let temp = await calculateGlobals();
      if(!!temp) {
        data = temp;
        break;
      }
    }
    const { stableMC, unstableMC, stableVol, unstableVol, stables, unstables } = data;
    const db = await CoinDB("coin-global").putGlobalData(interval, datetime, stableMC, unstableMC, stableVol, unstableVol);
    if(db['$response'].error) {
      body.status = "failed";
      console.error("DB ERROR => ", JSON.stringify(db));
    }

    //---------------- indiv coins ------------------ //
    const bothArr = [...stables, ...unstables];
    const dbReceipts = await storeCoinData(CSD_TABLE, bothArr, datetime);
    body.CSDReceipts = dbReceipts;
  } catch (err) {
    statusCode = 500;
    body.globalStatus = "failed";
    body.message = err.message;
  }
  return {
    statusCode,
    body,
    headers
  };
}

const calculateGlobals = async () => {
  let [stableMC, stableVol, unstableMC, unstableVol] = [0, 0, 0, 0];
  const unStableResp = await coinService().getCoinData(coinList);
  const unstables = Object.keys(unStableResp).map(key => { 
    unStableResp[key]["coin"] = key;
    return unStableResp[key];
  });
  const stableResp = await coinService().getCoinData(stableCoins.join());
  const stables = Object.keys(stableResp).map(key => {
    stableResp[key]["coin"] = key;
    return stableResp[key];
  });
  if(Array.isArray(unstables)) {
    for(let i=0; i<unstables.length; i++) {
      if(unstables[i]['usd_market_cap'] === 0) {
        console.error("**ISSUE**: 0 MC => ", JSON.stringify(unstables[i]));
      }
      unstableMC += unstables[i]['usd_market_cap'];
      unstableVol += unstables[i]['usd_24h_vol'];
    }
  }
  if(Array.isArray(stables)) {
    for(let i=0; i<stables.length; i++) {
      if(stables[i]['usd_market_cap'] === 0) {
        console.error("**ISSUE**: 0 MC => ", JSON.stringify(stables[i]));
      }
      stableMC += stables[i]['usd_market_cap'];
      stableVol += stables[i]['usd_24h_vol'];
    }
  }
  stableMC = Math.floor(stableMC);
  unstableMC = Math.floor(unstableMC);
  stableVol = Math.floor(stableVol);
  unstableVol = Math.floor(unstableVol);
  const numArr = [stableMC, unstableMC, stableVol, unstableVol];
  if(numArr.includes(0)) {
    return false;
  }
  return {
    stableMC,
    unstableMC,
    stableVol,
    unstableVol,
    stables,
    unstables
  };
}

const storeCoinData = async (table, coinArr, datetime) => {
  const receipt = [];
  for(let coinData of coinArr) {
    try {
      const { coin, usd_market_cap, usd_24h_vol, usd } = coinData;
      const mc = Math.floor(usd_market_cap);
      const vol = Math.floor(usd_24h_vol);
      const db = await CoinDB(table).putCSDData(coin, datetime, usd, mc, vol);
      receipt.push({coin, status: 200});
      await timeout(500);
    } catch (e) {
      //TODO: save error to S3 bucket
      console.error(`${coinData.coin} => DB operation failed : ${JSON.stringify(e)}`);
      receipt.push({coin: coinData.coin, status: 500});
    }
  }
  return receipt;
}

module.exports = { putGlobalCoinData }