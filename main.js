/**
 * Created by lanhao on 16/3/14.
 */
'use strict';
var colors = require('colors');
var async = require('async');
var httpAgent = require('./libs/httpAgent');
var dataProvider = require('./libs/dataProvider');

if(!process.argv[2]){
    console.log('usage: node tester [apiConfig]');
    process.exit(-1);
}
var uc = require('./apiDocs/'+process.argv[2]);

if(process.argv[3] && process.argv[3]!='all'){
    if(!uc.apis[process.argv[3]]){
        console.log('current API ['+process.argv[3]+'] not defined');
        process.exit(-1);
    }
    var currentApi = uc.apis[process.argv[3]];
    uc.apis = {};
    uc.apis[process.argv[3]] = currentApi;
}

if(process.argv[4]){
    try{
        process.dataProviderCache = JSON.parse(process.argv[4]);
    }catch(ex){
        console.log('parse json failed');
        console.log(process.argv[4]);
        process.exit(-1);
    }
}


async.eachSeries(uc.apis, function (item, callback) {
    console.log('测试接口：［'+colors.blue(item.name)+']');
    var dp = new dataProvider(item);
    item = dp.generator();
    if(httpAgent[item.method]){
        httpAgent.headers = item.header;

        httpAgent[item.method](uc.host+item.uri,item.body, function (e, r) {
            console.log(r.body);
            dp.validation(r.body);
            console.log(colorsFy(dp.report));

            callback(null,null);
        });
    }else{
        callback(true,'method not exist');
    }
}, function (err, ret) {
    //console.log(err,ret);
});

function colorsFy(obj){
    var result = '{';
    for(let i in obj){
        result += i+' : ';
        if(typeof obj[i] == 'object'){
            result += colorsFy(obj[i]);
        }else{
            result += (obj[i]==true)?colors.green('true'):colors.red('false');
        }
        result += ' , ';
    }
    return result+'}';
}