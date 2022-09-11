const axios = require('axios');

const coinService = () => {

  const _getCoinData = async (coinList) => {
    const resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinList}&vs_currencies=usd&include_market_cap=true&include_last_updated_at=true&include_24hr_vol=true`);
    return resp.data;
  }

  return {
    getCoinData: _getCoinData
  }
}

module.exports = { coinService };