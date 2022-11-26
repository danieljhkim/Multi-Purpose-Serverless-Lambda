const { CoinDB } = require('../../aws/dynamo/dao/coinDB');
const { jparse, timeout } = require('../../helpers/util');
const { coinIndex, stableCoins } = require('../../helpers/constants');
const sparkline = require('node-sparkline');
const fs = require("fs");
const { S3 } = require('../../aws/s3');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const path = require('path');

const storeChart = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = end - 60 * 60 * 24 * 5; // last 5 days
    for(let coin of coinIndex) {
      const data = await CoinDB(process.env.CSD_HOURLY_TABLE).getChartData(coin, start, end);
      const graphData = data.map((item) => item.market_cap);
      generateChart(graphData, coin);
      await timeout(1000);
    }
    for(let coin of stableCoins) {
      const data = await CoinDB(process.env.CSD_HOURLY_TABLE).getChartData(coin, start, end);
      const graphData = data.map((item) => item.market_cap);
      generateChart(graphData, coin);
      await timeout(1000);
    }
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
    console.error(e);
    //TODO: log error in S3
  }
}

module.exports = { storeChart };