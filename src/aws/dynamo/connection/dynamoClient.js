const AWS = require('aws-sdk');
const { SCHEMA } = require('../constants')

const _dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMO_REGION || 'us-east-1',
  apiVersion: 'latest'
});

const dynamoClient = (tableName) => {

  const _param = {
    TableName: tableName,
  }

  const _SCHEMA = SCHEMA[tableName];
  if(!_SCHEMA) throw new Error("Invalid Table Name: " + tableName);

  const _get = async ({ pk, sk }) => {
    const _param_g = Object.assign({}, _param);
    _param_g.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    };
    try {
      const data = await _dynamo.get(_param_g).promise();
      return data.Item;
    } catch(e) {
      //TODO: error response
      throw new Error(e.message);
    }
  }

  const _query = async ({ pk }) => {
    const _param_q = Object.assign({}, _param);
    _param_q.KeyConditionExpression = `#PK = :pk`;
    _param_q.ExpressionAttributeNames = {
      "#PK": _SCHEMA.partitionKey,
    };
    _param_q.ExpressionAttributeValues = {
      ':pk': pk.toUpperCase()
    };
    try {
      const data = await _dynamo.query(_param_q).promise();
      return data.Items;
    } catch(e) {
      //TODO: error response
      throw new Error(e.message);
    }
  }

  const _queryWithSortRange = async ({ pk, start, end }) => {
    const _param_qs = Object.assign({}, _param);
    _param_qs.KeyConditionExpression = '#PK=:pv AND #SK BETWEEN :bd and :ed';
    _param_qs.ExpressionAttributeNames = {
      '#PK': _SCHEMA.partitionKey,
      '#SK': _SCHEMA.sortKey
    };
    _param_qs.ExpressionAttributeValues = {
      ':pv': pk,
      ':bd': start,
      ':ed': end,
    }
    try {
      const data = await _dynamo.query(_param_qs).promise();
      return data.Items;
    } catch(e) {
      console.error(`ERROR fetching data -> ${e}`);
      throw e;
    }
  }

  const _scanFilter = async ({ attribute, value }) => {
    const _param_sf = Object.assign({}, _param);
    _param_sf.FilterExpression = `#AT = :at`;
    _param_sf.ExpressionAttributeNames = {
      "#AT": attribute,
    };
    _param_sf.ExpressionAttributeValues = {
      ':at': value
    };
    try {
      const data = await _dynamo.scan(_param_sf).promise();
      return data.Items;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _scan = async () => {
    //return all data
    const _param_s = Object.assign({}, _param);
    _param_s.Select = "ALL_ATTRIBUTES";
    try {
      const data = await _dynamo.scan(_param_s).promise();
      return data.Items;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _put = async ({ pk, sk, items }) => {
    const _param_p = Object.assign({}, _param);
    _param_p.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param_p.Item = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
      ...items,
    };
    try {
      const data = await _dynamo.put(_param_p).promise();
      return data;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _updateSingle = async ({ pk, sk }, {column, value}) => {
    const _param_u = Object.assign({}, _param);
    _param_u.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param_u.UpdateExpression = 'SET #COL = :val';
    _param_u.ExpressionAttributeNames = {
      "#COL": column,
    };
    _param_u.ExpressionAttributeValues = {
      ':val': value
    };
    _param_u.ReturnValues = 'All_NEW';
    try {
      const data = await _dynamo.update(_param_u).promise();
      return data;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _update = async ({ pk, sk, items }) => {
    const _param_u = Object.assign({}, _param);
    _param_u.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param_u.UpdateExpression = `set ${Object.keys(items).map(key => `#${key} = :${key}`).join(', ')}`;
    _param_u.ExpressionAttributeNames = {
      ...Object.keys(items).reduce((acc, key) => {
        acc[`#${key}`] = key;
        return acc;
      }, {}),
    };
    _param_u.ExpressionAttributeValues = {
      ...Object.keys(items).reduce((acc, key) => {
        acc[`:${key}`] = items[key];
        return acc;
      }, {}),
    };
    try {
      const data = await _dynamo.update(_param_u).promise();
      return data;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  return {
    get: _get,
    query: _query,
    scan: _scan,
    scanFilter: _scanFilter,
    put: _put,
    update: _update,
    updateSingle: _updateSingle,
    queryWithSortRange: _queryWithSortRange
  }
}

module.exports = { dynamoClient }