const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { jparse, timeout } = require('../../helpers/util');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const sparkline = require('node-sparkline');
const fs = require("fs");
const { S3 } = require('../../aws/s3');
const { promisify } = require('util');
const { ERRORS } = require('../../audit/constants');
const writeFile = promisify(fs.writeFile);
const path = require('path');

const storeChart = async ({ eventBody, auditor }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = end - 60 * 60 * 24 * 5; // last 5 days
    await chartCsdIndex(start, end, auditor);
    for(let coin of coinIndex) {
      await chartCoins(coin, start, end, auditor);
    }
    for(let coin of stableCoins) {
      await chartCoins(coin, start, end, auditor);
    }
  } catch (err) {
    err = jparse(err);
    statusCode = err.statusCode || 500;
    body.message = err.message;
    const auditContent = {
      fileName: ERRORS.STORE_CHART,
      body: {
        message: err.message,
      }
    }
    auditor.pushAudit(auditContent);
  }
  return {
    statusCode,
    body,
    headers
  };
}

const chartCsdIndex = async (start, end, auditor) => {
  try {
    const globalData = await CoinDB("coin-global").getChartData("hourly", start, end);
    const stableMC = globalData.map(item => item.stable_mc);
    const csd50MC =  globalData.map(item => item.none_stable_mc);
    generateChart(stableMC, "CSD10");
    await timeout(1000);
    generateChart(csd50MC, "CSD50");
    await timeout(1000);
  } catch (err) {
    console.error("**EROR**: Failed to chart Global. Error ==> ", JSOON.stringify(err));
    const auditContent = {
      fileName: ERRORS.CHART_GLOBAL,
      body: {
        message: err.message,
        coin: "global"
      }
    }
    auditor.pushAudit(auditContent);
  }
}

const chartCoins = async (coin, start, end, auditor) => {
  try {
    const data = await CoinDB(process.env.CSD_HOURLY_TABLE).getChartData(coin, start, end);
    const graphData = data.map((item) => item.market_cap);
    generateChart(graphData, coin);
    await timeout(1000);
  } catch(e) {
    console.error(`"**EROR**: Failed to chart Coin: ${coin}. Error ==> ${JSON.stringify(e)}`);
    const auditContent = {
      fileName: ERRORS.CHART_COIN,
      body: {
        message: e.message,
        coin: coin
      }
    }
    auditor.pushAudit(auditContent);
  }
}

const generateChart = (data, coin) => {
  try {
    const first = data[0];
    const last = data[data.length-1];
    const color = first >= last ? '#CF0A0A': '#57bd0f';
    const svg = sparkline({
      values: data,
      width: 135,
      height: 50,
      stroke: color,
      strokeWidth: 1.25,
      strokeOpacity: 1,
    });
    //writeFile(path.join("tmp", `${coin}.svg`), svg);
    const fileName = `${coin}.svg`;
    S3(process.env['S3_BUCKET_SPARKLINE']).upload(svg, fileName);
  } catch(e) {
    console.error("**EROR**: Failed to store chart. Error ==> ", e.message);
    throw e;
  }
}

module.exports = { storeChart };