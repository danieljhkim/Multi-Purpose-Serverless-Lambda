const express = require('express');
const bodyParser = require('body-parser');
const { handler } = require('./src/app');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const port = process.env.PORT || 8080;

// Start Server for local development
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
      res.status(200).json(response.body);
    } catch (error) {
      console.error('Failed executing the command. Reason =>', error);
      const errorMsg = {statusCode: error.statusCode || 500, errorMessage: error.body?.message || error.body || error.message};
      res.status(500).json(errorMsg);
	}
  });
  app.use(router);
});
