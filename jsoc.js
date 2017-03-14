#!/usr/bin/env node
"use strict";
const _time = process.hrtime();

const async = require('async');
const EOL = require('os').EOL;
const fs = require('fs');
const colors = require('colors');
const yargs = require('yargs');
const requestAgent = require('request-agent').init();
const path = require('path');
const dataProvider = require('./libs/dataProvider');

const trans = require('./libs/translate');
const obj2md = require('./libs/func/obj2md');

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
      if(obj[i] == true){
        result += colors.green('true');
      }else{
        result += colors.red('false');
        console.error('');
      }
    }
    if (i < len - 1)
      result += ' , ';
  }
  return result + EOL + '    '.repeat(tab - 1) + '}';
};

const solvePlan = (plan) => {

  if(!fs.existsSync(plan)){
    plan = path.resolve(__dirname+'/plans/'+plan);
  }else{
    plan = path.resolve(plan);
  }
  return plan;
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
    default: {}
  })
  .options('l', {
    alias: 'list',
    default: false
  })
  .options('i', {
    alias: 'info',
    boolean: true,
    default: false
  })

  .options('v', {
    alias: 'version',
    default: false
  })
  .usage('Usage : jsoc {PlanName} [options]')
  .example('jsoc testApi -a user -d \'{"a":123}\'  // 测试testApi中的user接口 ')
  .help('h')
  .epilog('Power by Xiaolan 2016')
  .argv;

if(argv.version){
  const VERSION = require(__dirname+'/package.json').version;
  console.log(VERSION);
  process.exit(-1);
}

const command = argv._[0];

switch (command){
  case 'mock':
    process.mock = argv._[1];
    process.mock = solvePlan(process.mock);
    process.chdir(__dirname+'/web');

    require(process.cwd()+'/server');
    break;
  case 'markdown':
    var plan = argv._[1];

    let md = obj2md.make(plan);
    let keys = Object.keys(md);

    if(!md || keys.length<1){
      errorReport(colors.red('generating markdown error!'));
    }

    let output = argv.output ? argv.output :  process.cwd()+ '/' + plan.replace('.json','') + '.md';

    if(keys.length>1) {
      for (let k in md) {
        fs.writeFileSync(output.replace('.md', '_' + k + '.md'), md[k]);
      }
    }else{
      fs.writeFileSync(output, md['']);
    }
    break;
  default :
    var plan = argv._[1];
    plan = require(solvePlan(plan));
    var apis = plan.apis;
    if(argv.list){
      console.log(Object.keys(apis));
      process.exit(-1);
    }
    if(argv.api !== 'all'){
      for(let k in apis){
        if(k != argv.api){
          delete apis[k];
        }
      }
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
    break;
}



//
//
//} else {
//  errorReport('Plan [ ' + colors.red(planName) + ' ] not exists');
//}
