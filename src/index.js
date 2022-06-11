const AWS = require('aws-sdk');
const axios = require('axios');

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  apiVersion: 'latest',
});

if(false) {
  AWS.config.update({
    accessKeyId: "AKIAXYPR2TVB52HBIAD6",
    secretAccessKey: "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"
  });
}

const coinList = ["ethereum,bitcoin,xrp,solana,dogecoin,tether,usd-coin,binancecoin,cardano,binance-usd,polkadot,wrapped-bitcoin,tron,dai,staked-ether,avalanche-2,shiba-inu,leo-token,crypto-com-chain,matic-network,stellar,bitcoin-cash,ftx-token,monero,ethereum-classic,vechai"]

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
      let dateTime = "";
      let resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinList}&vs_currencies=usd&include_market_cap=true&include_last_updated_at=true&include_24hr_vol=true`);
      let respData = resp.data
      body.status = [];
      let i = 0;
      for(let obj in respData) {
        let name = Object.keys(respData)[i++];
        let data = respData[name];
        totalMC += data.usd_market_cap;
        totalVol += data.usd_24h_vol;
        dateTime = data.last_updated_at.toString();
        let db = await putData(name, data.last_updated_at.toString(), data.usd, data.usd_market_cap, data.usd_24h_vol);
        if(db?.$response?.error === null) {
          console.log(`DB update success => ${JSON.stringify(db)}`);
          body.status.push(`${name} => success`);
        } else {
          body.status.push(`${name} => failed`);
        }
      }
      const db = await putData("global", dateTime, 0, totalMC, totalVol);
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

async function putData(name, date, price, mc, vol) {
  const params = {
    TableName: "coins",
    Key: {
      coin: name,
      datetime: date,
    },
    Item: { 
      coin: name,
      datetime: date,
      price: price,
      market_cap: mc,
      volumn: vol
    },
  };
  try {
    const data = await dynamo.put(params).promise();
    return data;
  } catch(e) {
    console.error(`ERROR putting data -> ${e}`);
    throw e;
  }
}
