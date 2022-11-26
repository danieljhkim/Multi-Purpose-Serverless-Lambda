const { s3Client } = require('./connection/s3Client');

const S3 = (bucket="csd-sparkline-charts") => {

  const _upload = (entries, fileName, contentType="image/svg+xml") => {
    const _params = {
      Bucket: bucket,
      Key: fileName,
      Body: entries,
      ContentType: contentType
    };
    s3Client.upload(_params, (error, data) => {
      if (error) {
        console.error("## Failed uploading to S3. Error ==> ", JSON.stringify(error));
      } else {
        console.log("## Success uploading to S3. data ==> ", JSON.stringify(data));
      }
    });
  }

  const _get = async (fileName) => {
    const _params = {
      Bucket: bucket,
      Key: fileName,
    };
    try {
      const resp = await s3Client.getObject(_params).promise();
      console.log("## Success getting S3 object.");
      return resp;
    } catch(e) {
      console.error("## Failed fetching from S3. Error ==> ", JSON.stringify(e));
    }
  }

  return {
    upload: _upload,
    get: _get,
  }
}

module.exports = { S3 };