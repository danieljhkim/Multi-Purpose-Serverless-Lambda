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

  const _putGlobalData = async (pk, date, stableMC, regMC, stableVol, regVol) => {
    //pk: hourly / daily
    const _items = {
      stable_mc: stableMC,
      none_stable_mc: regMC,
      stable_vol: stableVol,
      none_stable_vol: regVol,
      total_mc: stableMC + regMC,
      total_vol: stableVol + regVol
    };
    const data = await _dbClient.put({pk: pk, sk: date, items: _items});
    return data;
  }

  const _putCSDData = async (name, date, price, mc, vol) => {
    const _items = {
      price: price,
      market_cap: mc,
      volumn: vol
    };
    const data = await _dbClient.put({pk: name, sk: date, items: _items});
    return data;
  }

  return {
    putChartData: _putChartData,
    putGlobalData: _putGlobalData,
    putCSDData: _putCSDData
  }
}

module.exports = { CoinDB };