const { commands } = require('./commands');
const { jparse } = require('./helpers/util');
const errorAudit = require('./audit/errorAudit');
const { ERRORS } = require('./audit/constants');
const auditor = errorAudit();

exports.handler = async (event, context) => {
  try {
    const eventBody = jparse(event.body);
    console.log("#### EVENT BODY", JSON.stringify(eventBody));
    const command = commands[eventBody.action];
    if (!command) {
      throw new Error(`Action ${eventBody.action} is not supported.`);
    }
    const result = await command({ eventBody, context, auditor });

    const response = {
      statusCode: result.statusCode || 200,
      body: JSON.stringify(result.body),
      headers: result.headers || { "content-type": "application/json" },
    }
    return response;
  } catch(e) {
    console.error("**ERROR**: error in handler. Error ==> ", e.message);
    const response = {
      statusCode: e.statusCode || 500,
      body: { error: e.message },
      headers: { "content-type": "application/json" },
    };
    console.log("FINAL ERROR RESPONSE => " + JSON.stringify(response));
    const auditContent = {
      fileName: ERRORS.GENERAL_ERROR,
      body: {
        message: e.message,
        response:  response
      }
    }
    auditor.pushAudit(auditContent);
    return response;
  } finally {
    auditor.batchAudit();
    console.log("Auditing Done!");
  }
};
