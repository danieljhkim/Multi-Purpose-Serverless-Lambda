
const axios = require('axios');

const coinList = "ethereum,bitcoin,ripple,solana,dogecoin,tether,usd-coin,compound-usd-coin,theta-token,compound-ether,axie-infinity,true-usd,filecoin,decentraland,the-sandbox,apecoin,kucoin-shares,internet-computer,frax,binancecoin,cardano,binance-usd,okb,polkadot,chain-2,wrapped-bitcoin,tron,flow,dai,cosmos,staked-ether,tezos,theta-fuel,hedera-hashgraph,avalanche-2,near,uniswap,shiba-inu,vechain,leo-token,algorand,crypto-com-chain,matic-network,stellar,bitcoin-cash,ftx-token,monero,ethereum-classic,vechai";
const rCoins = ["ethereum", "bitcoin", "ripple"]
const stableCoins = ["tether", "usd-coin","binance-usd","dai","frax","true-usd","compound-usd-coin"]
const dbCoins = [...rCoins];

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body = {};
    let statusCode = '200';
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      let totalMC = 0;
      let totalVol = 0;
      let stableMC = 0;
      let stableVol = 0;
      let rMC = 0;
      let rVol = 0;
      let dateTime = "";
      let resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinList}&vs_currencies=usd&include_market_cap=true&include_last_updated_at=true&include_24hr_vol=true`);
      let respData = resp.data
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
          let db = await putData(name, data.last_updated_at.toString(), data.usd, data.usd_market_cap, data.usd_24h_vol);
          if(db?.$response?.error === null) {
            console.log(`DB update success => ${JSON.stringify(db)}`);
            body.status.push(`${name} => success`);
          } else {
            body.status.push(`${name} => failed`);
          }
        }
      }
      const db = await putGlobalData(dateTime, stableMC, rMC, stableVol, rVol, totalMC, totalVol);
    } catch (err) {
      statusCode = '400';
      body = err.message;
    } finally {
      body = JSON.stringify(body);
    }
    return {
      statusCode,
      body,
      headers,
    };
};
