const Joi = require("@hapi/joi");

exports.genericValidator = (params, types, inputs) => {
  const determineDataType = (type) => {
    let joi = {};
    switch (type) {
      case "string":
        joi = Joi.string();
      case "number":
        return Joi.number();
      case "boolean":
        joi = Joi.boolean();
      default:
        joi = Joi.any();
    }
    return joi;
  }
  if(params.length !== types.length){
    throw new Error("Params and types must be the same length");
  }
  const schema = {};
  for(let i=0; i<params.length; i++){
    schema[params[i]] = determineDataType(types[i]);
  }
  const finalSchema = Joi.object().keys(schema);
  return finalSchema.validate(inputs);
}