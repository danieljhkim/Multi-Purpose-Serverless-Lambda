# Multi-Purpose-Serverless-Lambda
This serverless lambda is designed to be used for multiple utilizations across multiple applications and services. This lambda has access to various AWS resources and has an interface for cross-platform operations. It is deployed as AWS Lambda and exposed via API Gateway.

Features:
- AWS DynamoDB Client Interface
- AWS S3 Client Interface
- AWS SNS Client Interface
- Error auditing to S3 Bucket for critical operations

# How to Use

### Local Setup

```
$ npm install
$ node express-app
```

### Invoke a Service (POST request)
```
## sample request body:

{
  "event": {
    "body": {
      "action": "WRITE_COINS_HOURLY_TO_DB",
      "days": 10
    }
  }
}

{
  "event": {
    "body": {
      "action": "GET_COINS_DB",
      "table": "coin-hourly",
      "coin": "eos",
      "start": 1659982050380,
      "end": 1660104217178
    }
  }
}
```

