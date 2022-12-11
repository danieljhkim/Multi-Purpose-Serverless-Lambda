const RestService = require('./wrapper/restService');
const { timeout } = require('../helpers/util');

const coinService = () => {

  const baseUrl = process.env.COIN_GET_BASE_URL;
  let retry = 0;

  const _getSimpleCoinData = async (coinList) => {
    try {
      const url = baseUrl + `/simple/price?ids=${coinList}&vs_currencies=usd&include_market_cap=true&include_last_updated_at=true&include_24hr_vol=true`;
      const resp = await RestService().get(url);
      return resp.data;
    } catch (err) {
      if(retry <= 5) {
        retry++;
        await timeout(10000);
        return _getSimpleCoinData(coinList);
      } else {
        console.error("AXIOS ERROR: ", JSON.stringify(err));
        return false
        //throw err;
      }
    }
  }

  const _getCoinMarketChart = async (coin, days) => {
    try {
      const url = baseUrl + `/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;
      const resp = await RestService().get(url);
      return resp.data;
    } catch(e) {
      if(retry <= 5) {
        retry++;
        await timeout(10000);
        return _getCoinMarketChart(coin, days);
      } else {
        console.error("AXIOS ERROR: ", JSON.stringify(e));
        return false;
        //throw e;
      }
    }
  }

  const _fetchDetailedData = async (coins) => {
    const url = baseUrl + `/coins/markets?ids=${coins}&vs_currency=usd&locale=en`;
    try {
      const resp = await RestService().get(url);
      return resp.data;
    } catch (error) {
      //throw error;
      return false;
    }
  }

  return {
    getCoinData: _getSimpleCoinData,
    getMarketChart: _getCoinMarketChart,
    fetchDetailedData: _fetchDetailedData
  }
}

module.exports = { coinService };