const { commands } = require('./commands');

exports.handler = async (event, context) => {
  try {
    const eventBody = JSON.parse(event.body);
    const command = commands[eventBody.action];
    if (!command) {
      throw new Error(`Action ${eventBody.action} is not supported.`);
    }
    const result = await command({ event, context });

    const response = {
      statusCode: result.statusCode || 200,
      body: JSON.stringify(result.body),
      headers: result.headers || { "content-type": "application/json" },
    }
    return response;
    
  } catch(e) {
    console.error(e);
    const response = {
      statusCode: e.statusCode || 500,
      body: JSON.stringify({ error: e.message }),
      headers: { "content-type": "application/json" },
    };
    return response;
  }
};
