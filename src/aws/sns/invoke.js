const SNSClient = require('./connection');

const SNS = ({ topicArn, options }) => {

  const exampleTemplate = `
    {
      "payload": {
        "title": "hello world",
        "body": "${options.body}"
      },
      "recipients": [{"username": "${options.username}"}],
      "example": ${JSON.stringify(options.example)}
    }
  `;

  const param = {
    Message: JSON.stringify({ "msg": exampleTemplate }),
    TopicArn: topicArn,
  };

  const _invoke = async (params) => {
    try {
      const resp = await SNSClient.publish(params).promise();
      console.log("SNS publish success. Resp ==> ", JSON.stringify(resp));
      return true;
    } catch (err) {
      console.error("SNS publish error. Error ==>", JSON.stringify(err));
      return false;
    }
  }

  return {
    invoke: _invoke,
  }
}
