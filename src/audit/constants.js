const ERRORS = {
  //--------- putGlobalData ------------//
  PUT_GLOBAL_DATA: 'PUT_GLOBAL_DATA',
  DB_ERROR_PUT_GLOBAL: 'DB_ERROR_PUT_GLOBAL',

  //--------- putHourlyData ------------//
  PUT_HOURLY_DATA: 'PUT_HOURLY_DATA',
  VOL_TIME_MISMATCH: 'VOL_TIME_MISMATCH',
  MC_TIME_MISMATCH: 'MC_TIME_MISMATCH',
  DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',
  DB_ERROR_PUT_COIN: 'DB_ERROR_PUT_COIN',

    //--------- storeChart ------------//
    STORE_CHART: 'STORE_CHART',
    CHART_COIN: 'CHART_COIN',
    CHART_GLOBAL: 'CHART_GLOBAL',

    //--------- app.handler ------------//
    GENERAL_ERROR: 'GENERAL_ERROR',
}

module.exports = { ERRORS };