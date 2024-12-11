const axios = require("axios");
const logger = require("../logger");

const http = axios.create({
  timeout: 10000,
});

http.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    logger.error(error);
    return Promise.reject(error);
  }
);

module.exports = http;
