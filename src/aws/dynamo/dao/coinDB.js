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

  const _getChartData = async (name, start, end) => {
    const data = await _dbClient.queryWithSortRange({pk: name, start, end});
    return data;
  }

  const _updateBatchCoins = async (coins) => {
    const items = { data: coins };
    const data = await _dbClient.putPKOnly({ pk: "latest", items });
    return data;
  }

  const _getBatchCoins = async (pk="latest") => {
    const data = await _dbClient.query({ pk });
    return data;
  }

  return {
    putChartData: _putChartData,
    putGlobalData: _putGlobalData,
    putCSDData: _putCSDData,
    getChartData: _getChartData,
    updateBatchCoins: _updateBatchCoins,
    getBatchCoins: _getBatchCoins
  }
}

module.exports = { CoinDB };