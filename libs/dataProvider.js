'use strict';
const colors = require('colors');

class DataProvider {
  constructor(apiConfig, data){
    this.apiConfig = apiConfig;
    this.cache = data || {};
    this.report = {};
  }

  generator(){
    let _self = this;
    let apiConfig = this.apiConfig;

    if (apiConfig.request.headers && (typeof apiConfig.request.headers) == 'object') {
      apiConfig.request.headers = this.data(apiConfig.request.headers);
    }
    if (apiConfig.request.body && typeof apiConfig.request.body == 'object') {
      apiConfig.request.body = this.data(apiConfig.request.body);
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
        apiConfig.request.query = this.data(apiConfig.request.query);
        for (let k in apiConfig.request.query) {
          apiConfig.request.uri += k + '=' + apiConfig.request.query[k] + '&';
        }
      }
    }
    return apiConfig;
  }

  data(item){
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
  }

  validation(body, config, report){
    report = report ? report : this.report;
    let returnConfig = config ? config : this.apiConfig.response.body;

    for (let k in returnConfig) {
      if(returnConfig[k]._schema){
        delete returnConfig[k]._schema;
      }

      if ((typeof returnConfig[k] == 'object') && (!returnConfig[k]._type) && (returnConfig[k]._assert === undefined)) {

        if(body[k] === null && (Object.keys(returnConfig[k]).length>0)){
          report[k] = false;
        }else if(Object.keys(returnConfig[k]).length === 0){
          report[k] = true;
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
  }

  isType(){
    let isType = require('./func/isType.js');
    return isType(...arguments);
  }
}


module.exports = DataProvider;
