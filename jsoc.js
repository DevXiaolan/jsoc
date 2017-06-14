#!/usr/bin/env node
"use strict";

const async = require('async');
const EOL = require('os').EOL;
const fs = require('fs');
const colors = require('colors');
const yargs = require('yargs');
const requestAgent = require('request-agent').init();
const path = require('path');
const dataProvider = require('./libs/dataProvider');
const colorsFy = require('./func/colorsFy');
const obj2md = require('./func/obj2md');

const errorReport = (msg) => {
  console.log(EOL.repeat(2) + msg + EOL.repeat(2));
  process.exit(-1);
};


const solvePlan = (plan) => {
  if(!fs.existsSync(plan)){
    errorReport(colors.red(`${plan} Not Found.`))
  }else{
    plan = path.resolve(plan);
  }
  return plan;
};

let argv = yargs
  .option('v', {
    alias:'version',
    default:false
  })
  .command('mock', 'run a mock server', (y) => {

    let argv = y.reset()
      .help('h')
      .usage(colors.yellow(`${EOL}jsoc mock {path/of/plan}`))
      .epilog(colors.green('Power by Xiaolan 2017'))
      .argv;

    if(argv._[1] === undefined){
      errorReport('jsoc mock -h')
    }

    process.plan = solvePlan(argv._[1]);

    process.chdir(__dirname+'/web');

    require(process.cwd()+'/server');

  })
  .command('md', 'generate a markdown documentation', (y) => {
    let argv = y.reset()
      .option('o', {
        alias:'output'
      })
      .usage(colors.yellow(`${EOL}jsoc md {path/of/plan}`))
      .epilog(colors.green('Power by Xiaolan 2017'))
      .help('h')
      .argv;

    if(argv._[1] === undefined){
      errorReport('jsoc md -h')
    }
    let plan = solvePlan(argv._[1]);
    let md = obj2md.make(plan);

    let keys = Object.keys(md);

    if(!md || keys.length<1){
      errorReport(colors.red('generating markdown error!'));
    }

    let output = argv.output ? argv.output : plan.replace('.json','') + '.md';

    for (let k in md) {
      fs.writeFileSync(output.replace('.md', '_' + k + '.md'), md[k]);
    }

    process.exit(-1);
  })
  .command('check', '', (y) => {
    let argv = y.reset()
      .help('h')
      .usage(colors.yellow(`${EOL}jsoc check {path/of/plan}`))
      .epilog(colors.green('Power by Xiaolan 2017'))
      .argv;
    if(argv._[1] === undefined){
      errorReport('jsoc check -h')
    }
    require('./libs/check')(solvePlan(argv._[1]));
  })
  .command('run', 'run a mock server', (y) => {
    let argv = y.reset()
      .help('h')
      .option('l', {
        alias:'list'
      })
      .option('a', {
        alias:'api',
        default:'all'
      })
      .option('b', {
        alias:'body'
      })
      .option('c', {
        alias:'color',
        default:true
      })
      .argv;
    if(argv._[1] === undefined){
      errorReport('jsoc run -h')
    }

    let plan = require(solvePlan(argv._[1]));

    let apis = plan.apis;

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
  })
  .help('h')
  .epilog(colors.green('Power by Xiaolan 2017'))
  .argv;

if(argv.version){
  const VERSION = require(__dirname+'/package.json').version;
  console.log(VERSION);
  process.exit(-1);
}
/*


const command = argv._[0];
let plan = argv._[1];
switch (command){


  default :
    if(plan === undefined){
      errorReport('jsoc -h');
    }
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

*/
