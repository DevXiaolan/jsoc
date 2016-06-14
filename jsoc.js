#!/usr/bin/env node
"use strict";

const async = require('async');
const os = require('os');
const fs = require('fs');
const EOL = (os && os.EOL)?os.EOL:'\n';
const colors = require('colors');
const yargs = require('yargs');
const requestAgent = require('request-agent').init();

const dataProvider = require('./libs/dataProvider');
const httpAgent = require('./libs/httpAgent');

const errorReport = (msg) =>{
    console.log(EOL.repeat(2)+msg+EOL.repeat(2));
    process.exit(-1);
};

const colorsFy = (obj,tab) => {
    tab = tab || 1;
    let len = Object.keys(obj).length;
    let result = '{';
    for(let i in obj){
        result += EOL+'    '.repeat(tab)+i+' : ';
        if(typeof obj[i] == 'object'){
            result += colorsFy(obj[i],tab+1);
        }else{
            result += (obj[i]==true)?colors.green('true'):colors.red('false');
        }
        if(i<len-1)
            result += ' , ';
    }
    return result+EOL+'    '.repeat(tab-1)+'}';
};

let argv = yargs
    .options('a',{
        alias:'api',
        default:'all',
    })
    .options('b',{
        alias:'body',
        boolean:true,
        default:false
    })
    .options('c',{
        alias:'color',
        boolean:true,
        default:true
    })
    .options('d',{
        alias:'data',
        default :'{}'
    })
    .usage('Usage : jsoc {PlanName} [options]')
    .example('jsoc testApi -a user -d \'{"a":123}\'  // 测试testApi中的user接口 ')
    .help('h')
    .epilog('Power by Xiaolan 2016')
    .argv;

let planName = argv._[0];

if(fs.existsSync(__dirname+'/plans/'+planName+'.js')){

    let plan = require(__dirname+'/plans/'+planName+'.js');

    if(argv.api != 'all'){
        if(plan.apis[argv.api]){
            let currentApi = plan.apis[argv.api]; 
            plan.apis = {};
            plan.apis[argv.api] = currentApi;
        }else{
            errorReport('Api [ '+colors.red(argv.api)+' ] not defined');
        }
    }

    try{
        argv.data = JSON.parse(argv.data);
    }catch(ex){
        errorReport('Parse data failed :  '+colors.red(argv.d)
            +' is not a correct JSON string.'
            +EOL+'See  '+colors.blue('jsoc -h')+' for more help');
    }

    async.eachSeries(plan.apis,  (item, callback) => {
        console.log('测试接口：［'+colors.blue(item.name)+']');
        let dp = new dataProvider(item);
        item = dp.generator();

        requestAgent
            .url(plan.host+item.request.uri)
            .headers(item.request.headers)
            .query(item.request.query)
            .body(item.request.body)
            .send()
            .then(requestAgent.toJson)
            .then( (obj) => {
                if(argv.body){
                    console.log('===== REQUEST =====');
                    console.log(item.request);
                    console.log('===== RESPONSE ====');
                    console.log(obj);
                    console.log('===== REPORT  =====');
                }
                dp.validation(obj);
                console.log(argv.color?colorsFy(dp.report):dp.report);
                callback(null,null);
            })
            .catch( (err) => {
                errorReport('Error: '+colors.red(err.toString()));
            });

        //httpAgent.headers = item.request.headers;
        //
        //httpAgent[item.request.method](plan.host+item.request.uri,item.request.body,  (e, r) => {
        //    if(argv.body){
        //        console.log('===== REQUEST =====');
        //        console.log(item.request);
        //        console.log('===== RESPONSE ====');
        //        console.log(r.body);
        //        console.log('===== REPORT  =====');
        //    }
        //
        //    dp.validation(r.body);
        //    console.log(argv.color?colorsFy(dp.report):dp.report);
        //
        //    callback(null,null);
        //});

    }, (err, ret) => {
        //console.log(err,ret);
    });





}else{
    errorReport('Plan [ '+colors.red(planName)+' ] not exists');
}

