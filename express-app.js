const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');
const fs = require('fs');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const getInt = (val, defVal) => {
  const parsed = parseInt(val);
  if (isNaN(parsed)) return defVal;
  return parsed;
};

const loadEnv = (envFile) => {
  const doc = yaml.safeLoad(fs.readFileSync(envFile, 'utf8'));
  const env = doc.Resources.MultiPurposeFunction.Properties.Environment.Variables;
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key];
  });
};

loadEnv('template.yaml');
const { handler } = require('./src/index');
const app = express();
const port = getInt(process.env.PORT, 8080);

// Start Server
app.listen(port, () => {
  console.log(`Function is running on ${port}...setting up route on /api`);
  const router = express.Router();
  app.use(bodyParser.json());

  router.post('/api', async (req, res, next) => {
    // transform payload in to event
    const { event } = req.body;
    const context = {};
    try {
      const response = await handler(event, context);
      console.log('Response =>', response);
      for(let entry in response.headers){
        res.setHeader(entry, response.headers[entry]);
	    }
      res.status(200).json(JSON.parse(response.body));
    } catch (error) {
      console.error('Failed executing the command. Reason =>', error);
      const errorMsg = {statusCode: error.statusCode || 500, errorMessage: error.body?.message || error.body || error.message};
      res.status(500).json(errorMsg);
	}
  });
  app.use(router);
});
