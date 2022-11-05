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
    _param.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    };
    try {
      const data = await _dynamo.get(_param).promise();
      return data.Item;
    } catch(e) {
      //TODO: error response
      throw new Error(e.message);
    }
  }

  const _query = async ({ pk }) => {
    _param.KeyConditionExpression = `#PK = :pk`;
    _param.ExpressionAttributeNames = {
      "#PK": _SCHEMA.partitionKey,
    };
    _param.ExpressionAttributeValues = {
      ':pk': pk.toUpperCase()
    };
    try {
      const data = await _dynamo.query(_param).promise();
      return data.Items;
    } catch(e) {
      //TODO: error response
      throw new Error(e.message);
    }
  }

  const _scanFilter = async ({ attribute, value }) => {
    _param.FilterExpression = `#AT = :at`;
    _param.ExpressionAttributeNames = {
      "#AT": attribute,
    };
    _param.ExpressionAttributeValues = {
      ':at': value
    };
    try {
      const data = await _dynamo.scan(_param).promise();
      return data.Items;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _scan = async () => {
    //return all data
    _param.Select = "ALL_ATTRIBUTES";
    try {
      const data = await _dynamo.scan(_param).promise();
      return data.Items;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _put = async ({ pk, sk, items }) => {
    _param.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param.Item = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
      ...items,
    };
    try {
      const data = await _dynamo.put(_param).promise();
      return data;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _updateSingle = async ({ pk, sk }, {column, value}) => {
    _param.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param.UpdateExpression = 'SET #COL = :val';
    _param.ExpressionAttributeNames = {
      "#COL": column,
    };
    _param.ExpressionAttributeValues = {
      ':val': value
    };
    _param.ReturnValues = 'All_NEW';
    try {
      const data = await _dynamo.update(_param).promise();
      return data;
    } catch(e) {
      throw new Error(e.message);
    }
  }

  const _update = async ({ pk, sk, items }) => {
    _param.Key = {
      [_SCHEMA.partitionKey]: pk,
      [_SCHEMA.sortKey]: sk,
    }
    _param.UpdateExpression = `set ${Object.keys(items).map(key => `#${key} = :${key}`).join(', ')}`;
    _param.ExpressionAttributeNames = {
      ...Object.keys(items).reduce((acc, key) => {
        acc[`#${key}`] = key;
        return acc;
      }, {}),
    };
    _param.ExpressionAttributeValues = {
      ...Object.keys(items).reduce((acc, key) => {
        acc[`:${key}`] = items[key];
        return acc;
      }, {}),
    };
    try {
      const data = await _dynamo.update(_param).promise();
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
  }
}

module.exports = { dynamoClient }