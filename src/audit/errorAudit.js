const { S3 } = require('../aws/s3');

const errorAudit = (bucket="") => {

  const _Bucket = bucket || process.env.AWS_S3_ERROR_BUCKET || "csd-error-audit-bucket";
  const _S3 = S3(_Bucket);

  const _audit = ({ fileName, body }) => {
    const Key = _buildPath({ fileName });
    const ContentType = "application/json; charset=utf-8";
    const Body = JSON.stringify(body);
    _S3.upload(Body, Key, ContentType);
  };

  const _buildPath = ({ fileName }) => {
    const _addZero = (item) => {
      item += "";
      if(item.length < 2) return "0" + item;
      return item;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = _addZero(date.getMonth() + 1);
    const key = `multiPurposeLambda/yyyymm=${year}-${month}}/`;
    return key + fileName;
  }

  return {
    audit: _audit
  }
}

module.exports = errorAudit