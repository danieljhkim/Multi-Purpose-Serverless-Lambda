const { dynamoClient } = require('../connection/dynamoClient');

const CoinDB = (tableName) => {

  const _dbClient = dynamoClient(tableName);

  const _putChartData = async (name, date, price, mc, vol) => {
    const _items = {
      price: price,
      market_cap: mc,
      volumn: vol
    };
    const data = await _dbClient.put({pk: name, sk: date, items: _items});
    return data;
  }

  const _putGlobalData = async (date, stableMC, regMC, stableVol, regVol, totalMC, totalVol) => {
    const _items = {
      stable_mc: stableMC,
      none_stable_mc: regMC,
      stable_vol: stableVol,
      none_stable_vol: regVol,
      total_mc: totalMC,
      total_vol: totalVol
    };
    const data = await _dbClient.put({pk: 'global', sk: date, items: _items});
    return data;
  }

  return {
    putChartData: _putChartData,
    putGlobalData: _putGlobalData
  }
}

module.exports = { CoinDB };