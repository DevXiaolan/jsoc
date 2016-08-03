'use strict';
const colors = require('colors');
let DataProvider = function (apiConfig, data) {

  this.apiConfig = apiConfig;
  if (!process.dataProviderCache) {
    process.dataProviderCache = {};
  }
  this.cache = process.dataProviderCache = data;
  this.report = {};
};

DataProvider.prototype.generator = function() {
  let _self = this;
  let apiConfig = this.apiConfig;
  if (apiConfig.request.headers && (typeof apiConfig.request.headers) == 'object') {
    for (let k in apiConfig.request.headers) {
      apiConfig.request.headers[k] = this.data(apiConfig.request.headers[k]);
    }
  }
  if (apiConfig.request.body && typeof apiConfig.request.body == 'object') {
    for (let k in apiConfig.request.body) {
      apiConfig.request.body[k] = this.data(apiConfig.request.body[k]);
    }
  }

  if (apiConfig.request.uri.indexOf('{') != -1) {

    apiConfig.request.uri = apiConfig.request.uri.replace(/{(.*?)}/g, function() {
      let p = arguments[1];

      if (apiConfig.request.params[p]) {
        return _self.data(apiConfig.request.params[p]);
      } else {
        return p;
      }
    });
  }

  if (apiConfig.request.query && typeof apiConfig.request.query == 'object') {
    for (let k in apiConfig.request.query) {
      apiConfig.request.uri += '?';
      for (let k in apiConfig.request.query) {
        apiConfig.request.query[k] = this.data(apiConfig.request.query[k]);
        apiConfig.request.uri += k + '=' + apiConfig.request.query[k] + '&';
      }
    }
  }
  return apiConfig;
};

DataProvider.prototype.data = function(item) {
  let ret = {};
  if (!item._type && !item._assert && !item._default && !item._to && !item._from) {
    for (let k in item) {
      ret[k] = this.data(item[k]);
    }
    return ret;
  } else {
    if (item._from && this.cache[item._from]) {
      ret = this.cache[item._from];
    } else {
      ret = require('./func/makeData')(item);
    }
    if (item._to) {
      this.cache[item._to] = ret;
    }
    return ret;
  }
};

DataProvider.prototype.validation = function(body, config, report){
  report = report ? report : this.report;
  let returnConfig = config ? config : this.apiConfig.response.body;

  for (let k in returnConfig) {

    if ((typeof returnConfig[k] == 'object') && (!returnConfig[k]._type) && (returnConfig[k]._assert === undefined)) {
      if(body[k] === null){
        report[k] = false;
      }else {
        report[k] = {};
        this.validation(body[k], returnConfig[k], report[k]);
      }
    } else {
      if (returnConfig[k]._required == 'false') {
        return true;
      }

      if ((returnConfig[k]._assert !== undefined )) {
        if (returnConfig[k]._assert == body[k]) {
          report[k] = true;
        } else {
          report[k] = false;
        }

      } else if ((!returnConfig[k]._assert) && returnConfig[k]._type) {
        let allowType = returnConfig[k]._type;

        report[k] = this.isType(allowType.toLowerCase(), body[k]);
      } else {
        report[k] = false;
      }
      if (returnConfig[k]._to) {
        this.cache[returnConfig[k]._to] = body[k];
      }
    }
  }
};

DataProvider.prototype.isType = require('./func/isType.js');


module.exports = DataProvider;

//test code
//new DataProvider().generator();