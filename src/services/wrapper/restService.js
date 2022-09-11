const axios = require('axios');

const RestService = (defaultConfig={}) => {

  const _buildConfig = (url, config, method="GET") =>  {
    const newConfig = Object.assign({}, defaultConfig);
    newConfig.url = url;
    newConfig.method = method;
    newConfig.headers = {...newConfig.headers, ...config.headers};
    return newConfig;
  };

  const _get = (url, config={}) => {
    const newConfig = _buildConfig(url, config, "GET");
    return axios(newConfig);
  }

  const _put = (url, config={}) => {
    const newConfig = _buildConfig(url, config, "PUT");
    return axios(newConfig);
  }

  const _post = (url, config={}) => {
    const newConfig = _buildConfig(url, config, "POST");
    return axios(newConfig);
  }

  const _delete = (url, config={}) => {
    const newConfig = _buildConfig(url, config, "DELETE");
    return axios(newConfig);
  }

  const _patch = (url, config={}) => {
    const newConfig = _buildConfig(url, config, "PATCH");
    return axios(newConfig);
  }

  return {
    get: _get,
    put: _put,
    post: _post,
    delete: _delete,
    patch: _patch,
  }
}

module.exports = RestService;