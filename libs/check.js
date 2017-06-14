/**
 * Created by lanhao on 2017/6/1.
 */

'use strict';
const path = require('path');
const colors = require('colors');
const EOL = require('os').EOL;
const isType = require('../func/isType');

const SWITCH = {
  schema: true
};

const ErrorStack = [];

const Fields = {
  _type: 1,
  _assert: 1,
  _schema: 1,
  _choices: 1,
  _length: 0,
  _from: 1,
  _to: 0,
  _required: 0
};

const check = function (plan) {
  let obj = null;
  console.log(plan);
  try {
    obj = require(plan);
  } catch (ex) {
    errorReport(`${plan} is not a json file`);
  }
  console.log('validating HOST'.yellow);
  if (obj.host === undefined || obj.host === '') {
    errorReport(' [host] Not Set'.gray);
  }
  if (!isType('url', obj.host)) {
    errorReport(' [host] is Not URL'.red);
  }
  pass();
  console.log('validating APIS'.yellow);
  let apis = obj.apis;

  for (let k in apis) {
    console.log(`#${k} :`.blue);
    checkApi(apis[k]);

    if (ErrorStack.length) {
      console.dir(ErrorStack);
      console.log(' failed'.red);
    }else{
      console.log(' ok'.green);
    }
    break;
  }

  pass();
  process.exit(-1);
  //check apis
  //warning if host not set
};

const checkApi = (api) => {
  const fields = ['name', 'request', 'response'];
  for (let k in fields) {
    if (api[fields[k]] === undefined || api[fields[k]] === null) {
      ErrorStack.push({
        data: api,
        pass: false,
        message: `api object must have a property "${fields[k]}"`.red
      });
    }
  }
  api.request && checkRequest(api.request);
};

const checkRequest = (req) => {
  if (!['get', 'post', 'put', 'delete', 'GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    ErrorStack.push({
      data: req,
      pass: false,
      message: 'Request Method [' + req.method.yellow + '] Not Allow'
    });
  }
  let _params = req.uri.match(/{(.*?)}/g);
  for (let k in _params) {
    if (!(req.params && req.params[_params[k].replace(/{|}/g, '')])) {
      ErrorStack.push({
        data: req,
        pass: false,
        message: `param [${_params[k].replace(/{|}/g, '').yellow}] not found for request.uri (${req.uri.yellow})`
      });
    }
  }
  //params
  for (let k in req.params) {
    checkEntity(req.params[k]);
  }
  //query
  for (let k in req.query) {
    checkEntity(req.query[k]);
  }
  //body
  for (let k in req.body) {
    checkEntity(req.body[k]);
  }
};

const checkEntity = (entity) => {
  if (typeof entity !== 'object') {
    ErrorStack.push({
      message: 'not an object',
      data: entity,
      pass: false
    });
  }
  let sum = 0;
  for (let k in entity) {
    if (Fields[k] !== undefined) {
      sum += Fields[k]
    }
  }
  if (sum < 1) {
    ErrorStack.push({
      message: 'entity is invalid( ref )',
      data: entity,
      pass: false
    });
  }
};

const response = (res) => {

};

const errorReport = (msg) => {
  console.log(EOL.repeat(1) + msg + EOL.repeat(1));
  process.exit(-1);
};

const pass = () => {
  console.log('PASS !!'.green);
};
module.exports = check;

//todo check返回信息提供一個url，頁面需要自己做