'use strict';
var colors = require('colors');
let DataProvider = function(apiConfig){
    this.apiConfig = apiConfig;
    if(!process.dataProviderCache){
        process.dataProviderCache = {};
    }
    this.cache = process.dataProviderCache;
    this.report = {};
};

DataProvider.prototype.generator = function(){
    var apiConfig = this.apiConfig;
    if(apiConfig.header && (typeof apiConfig.header) == 'object'){
        for(let k in apiConfig.header){
            apiConfig.header[k] = this.data(apiConfig.header[k]);
        }
    }
    if(apiConfig.body && typeof apiConfig.body == 'object'){
        for(let k in apiConfig.body){
            apiConfig.body[k] = this.data(apiConfig.body[k]);
        }
    }
    
    if(apiConfig.uri.indexOf('{')!=-1){
        for(let k in this.cache){
            apiConfig.uri = apiConfig.uri.replace('{' + k + '}', this.cache[k]);
        }
        if(apiConfig.uri.indexOf('{')!=-1) {
            console.log('未找到预设数据，URL生成失败');
            console.log(apiConfig.uri);
            process.exit(-2);
        }
    }
    if(apiConfig.query && typeof apiConfig.query == 'object'){
        for(let k in apiConfig.query){
            apiConfig.uri += '?';
            for(let k in apiConfig.query){
                apiConfig.query[k] = this.data(apiConfig.query[k]);
                apiConfig.uri += k+'='+apiConfig.query[k]+'&';
            }
        }
    }
    return apiConfig;
};

DataProvider.prototype.data = function (item) {
    var ret = null;
    if(item.from && this.cache[item.from]){
        ret = this.cache[item.from];
    }else {
        ret = require('./func/makeData')(item.type,item.length);
    }
    if(item.to){
        this.cache[item.to] = ret;
    }
    return ret;
};

DataProvider.prototype.validation = function (body,config,report) {
    var report = report?report:this.report;
    var returnConfig = config?config:this.apiConfig.return;
    for(let k in returnConfig){
        if((typeof returnConfig[k] == 'object') && (!returnConfig[k].type) && (!returnConfig[k].assert)){
            report[k] = {};
            this.validation(body[k],returnConfig[k],report[k]);
        }else{

            if(returnConfig[k].assert && (returnConfig[k].assert == body[k])){
                report[k] = true;
            }else if((!returnConfig[k].assert) && returnConfig[k].type){
                var allowType = returnConfig[k].type.split('||');
                report[k] = false;
                for(let i in allowType){
                    report[k] = report[k] || this.isType(allowType[i].toLowerCase(),body[k]);
                }
            }else{
                report[k] = false;
            }
            if(returnConfig[k].to){
                this.cache[returnConfig[k].to] = body[k];
            }
        }
    }
};

DataProvider.prototype.isType = require('./func/isType.js');


module.exports = DataProvider;

