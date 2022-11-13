const COIN_GLOBAL_SCHEMA = {
  partitionKey: "interval",
  sortKey: "datetime",
}

const COIN_HORULY_SCHEMA = {
  partitionKey: "coin",
  sortKey: "datetime",
}

const COIN_DAILY_SCHEMA = {
  partitionKey: "coin",
  sortKey: "datetime",
}

const CSD_HOURLY_SCHEMA = {
  partitionKey: "coin",
  sortKey: "datetime",
}

const CSD_DAILY_SCHEMA = {
  partitionKey: "coin",
  sortKey: "datetime",
}

const SCHEMA = {
  //tableName: schema
  "coin-daily": COIN_DAILY_SCHEMA,
  "coin-hourly": COIN_HORULY_SCHEMA,
  "coin-global": COIN_GLOBAL_SCHEMA,
  "CSD-hourly": CSD_HOURLY_SCHEMA,
  "CSD-daily": CSD_DAILY_SCHEMA,
  "testing": CSD_HOURLY_SCHEMA,
}
module.exports = { COIN_GLOBAL_SCHEMA, COIN_HORULY_SCHEMA, COIN_DAILY_SCHEMA, SCHEMA }