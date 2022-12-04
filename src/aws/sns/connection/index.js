const AWS = require('aws-sdk');

const SNSClient = new AWS.SNS({
  region: process.env.SNS_REGION || 'us-east-1',
});

module. exports = SNSClient;