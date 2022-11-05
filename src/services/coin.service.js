const RestService = require('./wrapper/restService');

const coinService = () => {

  const baseUrl = process.env.COIN_GET_BASE_URL;

  const _getSimpleCoinData = async (coinList) => {
    const url = baseUrl + `/simple/price?ids=${coinList}&vs_currencies=usd&include_market_cap=true&include_last_updated_at=true&include_24hr_vol=true`;
    const resp = await RestService().get(url);
    return resp.data;
  }

  const _getCoinMarketChart = async (coin, days) => {
    const url = baseUrl + `/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;
    const resp = await RestService().get(url);
    return resp.data;
  }

  return {
    getCoinData: _getSimpleCoinData,
    getMarketChart: _getCoinMarketChart
  }
}

module.exports = { coinService };