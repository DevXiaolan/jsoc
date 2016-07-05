#!/usr/bin/env node
"use strict";

const async = require('async');
const os = require('os');
const fs = require('fs');
const EOL = (os && os.EOL) ? os.EOL : '\n';
const colors = require('colors');
const yargs = require('yargs');
const requestAgent = require('request-agent').init();

const dataProvider = require('./libs/dataProvider');
const httpAgent = require('./libs/httpAgent');

const errorReport = (msg) => {
  console.log(EOL.repeat(2) + msg + EOL.repeat(2));
  process.exit(-1);
};

const colorsFy = (obj, tab) => {
  tab = tab || 1;
  let len = Object.keys(obj).length;
  let result = '{';
  for (let i in obj) {
    result += EOL + '    '.repeat(tab) + i + ' : ';
    if (typeof obj[i] == 'object') {
      result += colorsFy(obj[i], tab + 1);
    } else {
      result += (obj[i] == true) ? colors.green('true') : colors.red('false');
    }
    if (i < len - 1)
      result += ' , ';
  }
  return result + EOL + '    '.repeat(tab - 1) + '}';
};

let argv = yargs
  .options('a', {
    alias: 'api',
    default: 'all',
  })
  .options('b', {
    alias: 'body',
    boolean: true,
    default: false
  })
  .options('c', {
    alias: 'color',
    boolean: true,
    default: true
  })
  .options('d', {
    alias: 'data',
    default: '{}'
  })
  .options('l', {
    alias: 'list',
    boolean: true,
    default: false
  })
  .options('i', {
    alias: 'info',
    boolean: true,
    default: false
  })
  .usage('Usage : jsoc {PlanName} [options]')
  .example('jsoc testApi -a user -d \'{"a":123}\'  // 测试testApi中的user接口 ')
  .help('h')
  .epilog('Power by Xiaolan 2016')
  .argv;

let planName = argv._[0];

if (fs.existsSync(__dirname + '/plans/' + planName + '.js')) {

  let plan = require(__dirname + '/plans/' + planName + '.js');

  if(argv.list){
    console.log(Object.keys(plan.apis));
    process.exit(-1);
  }

  if (argv.api != 'all') {
    let apis = argv.api.split(',');
    let Apis = {};
    for (let k in apis) {
      if (plan.apis[apis[k]]) {
        Apis[apis[k]] = plan.apis[apis[k]];
      } else {
        errorReport('Api [ ' + colors.red(apis[k]) + ' ] not defined');
      }
    }
    plan.apis = Apis;
  }
  if(argv.info){
    console.log(JSON.stringify(plan.apis,null,4));
    process.exit(-1);
  }
  try {
    if(typeof argv.data === 'string'){
      argv.data = JSON.parse(argv.data);
    }
  } catch (ex) {
    errorReport('Parse data failed :  ' + colors.red(argv.d)
      + ' is not a correct JSON string.'
      + EOL + 'See  ' + colors.blue('jsoc -h') + ' for more help');
  }

  async.eachSeries(plan.apis, (item, callback) => {
    console.log('测试接口：［' + colors.blue(item.name) + ']');
    let dp = new dataProvider(item, argv.data);
    item = dp.generator();

    requestAgent
      .url(plan.host + item.request.uri)
      .headers(item.request.headers)
      .method(item.request.method)
      .query(item.request.query)
      .body(item.request.body)
      .send()
      .then(requestAgent.toJson)
      .then((obj) => {
        if (argv.body) {
          console.log('===== REQUEST =====');
          console.log(item.request);
          console.log('===== RESPONSE ====');
          console.log(obj);
          console.log('===== REPORT  =====');
        }
        dp.validation(obj);
        console.log(argv.color ? colorsFy(dp.report) : dp.report);
        callback(null, null);
      })
      .catch((err) => {
        errorReport('Error: ' + colors.red(err.toString()));
      });

  }, (err, ret) => {
    //console.log(err,ret);
  });


} else {
  errorReport('Plan [ ' + colors.red(planName) + ' ] not exists');
}

