/**
 * Created by lanhao on 16/3/14.
 */
'use strict';
var os = require('os');
var EOL = (os && os.EOL)?os.EOL:'\n';
var colors = require('colors');
var async = require('async');
var httpAgent = require('./libs/httpAgent');
var dataProvider = require('./libs/dataProvider');

var options = {
    'body':false
};

if(!process.argv[2]){
    console.log('usage: node main.js [apiConfig]');
    process.exit(-1);
}


for(let k in process.argv){
    if(process.argv[k] == '--body'){
        process.argv.splice(k ,1);
        options.body = true;
    }
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

    if(httpAgent[item.request.method]){
        httpAgent.headers = item.request.header;
    
        httpAgent[item.request.method](uc.host+item.request.uri,item.request.body, function (e, r) {
            if(options.body){
                console.log(item.request);
                console.log(r.body);
            }

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

function colorsFy(obj,tab){
    var tab = tab || 1;
    var len = Object.keys(obj).length;
    var result = '{';
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
}