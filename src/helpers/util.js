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

module.exports = { jparse };