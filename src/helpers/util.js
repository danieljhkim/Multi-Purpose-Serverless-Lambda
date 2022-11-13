const jparse = (obj) => {
  let output = {};
  try {
      output = JSON.parse(obj);
  } catch (error) {
    try {
      output = JSON.parse(JSON.stringify(obj));
    } catch (error) {
      return obj;
    }
  }
  return output;
}

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { jparse, timeout };