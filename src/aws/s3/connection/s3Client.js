const AWS = require('aws-sdk');

const s3Client = new AWS.S3();

module.exports = { s3Client };