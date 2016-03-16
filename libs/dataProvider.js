'use strict';

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
    return apiConfig;
};

DataProvider.prototype.data = function (item) {
    item.type = item.type.toLowerCase();
    var ret = null;
    if(item.from && this.cache[item.from]){
        ret = this.cache[item.from];
    }else {
        switch (item.type) {
            case 'string':
                ret = 'test_string_' + (Date.now() % 1000000);
                break;
            case 'number':
                ret = Math.floor(Math.random() * 777777 + 152718);
                break;
            case 'mobile':
                ret = Number.parseInt('13800' + Math.floor(Math.random() * 777777 + 152718));
                break;
            case 'email':
                ret = 'test_email_' + (Date.now() % 1000000) + '@tfftest.cn';
                break;
            case 'password':
                ret = '123456';
                break;
            default :
                ret = null;
                break;
        }
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

DataProvider.prototype.isType = function(type,val){
    switch (type){
        case 'string':
            return /^[A-Za-z0-9]+$/.test(val);
            break;
        case 'number':
            return /[0-9]+/.test(val);
            break;
        case 'mobile':
            return /1[0-9]{10}/.test(val);
            break;
        case 'email':
            return /[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z0-9]+/.test(val);
            break;
        case 'password':
            return val == 123456;
            break;
        case 'null':
            return val === null;
            break;
        case 'object':
            return typeof val == 'object' && !Array.isArray(val);
        case 'array':
            return Array.isArray(val);
            break;
        default :
            break;
    }
};


module.exports = DataProvider;
