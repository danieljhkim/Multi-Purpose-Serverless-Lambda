const { commands } = require('./commands');
const { jparse } = require('./helpers/util')

exports.handler = async (event, context) => {
  try {
    const eventBody = jparse(event.body);
    const command = commands[eventBody.action];
    if (!command) {
      throw new Error(`Action ${eventBody.action} is not supported.`);
    }
    const result = await command({ eventBody, context });

    const response = {
      statusCode: result.statusCode || 200,
      body: result.body,
      headers: result.headers || { "content-type": "application/json" },
    }
    return response;
  } catch(e) {
    console.error(e);
    const response = {
      statusCode: e.statusCode || 500,
      body: { error: e.message },
      headers: { "content-type": "application/json" },
    };
    return response;
  }
};
