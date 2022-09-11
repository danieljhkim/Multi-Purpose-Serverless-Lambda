const { s3Client } = require('./connection/s3Client');

const s3Upload = (entries) => {
  const _params = {
    Bucket: entries.bucket,
    Key: entries.fileName,
    Body: JSON.stringify(entries),
    ContentType: "applicatoin/json; charset=utf-8"
  };
  s3Client.upload(_params, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
}

module.exports = { s3Upload };