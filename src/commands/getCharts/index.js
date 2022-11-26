const { jparse } = require('../../helpers/util');
const { coinIndex } = require('../../helpers/constants');
const { S3 } = require('../../aws/s3');

const getCharts = async ({ eventBody }) => {
  console.log('Received event:', JSON.stringify(eventBody, null, 2));
  let body = {};
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const coins = eventBody.coins || coinIndex;
    const images = [];
    for(let coin of coins) {
      const fileName = `${coin}.svg`;
      const image = await S3(process.env['S3_BUCKET_SPARKLINE']).get(fileName);
      const data = {
        image,
        coin
      };
      images.push(data);
    }
    body.body = images;
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

module.exports = { getCharts };