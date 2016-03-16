var client = require('easymysql');

var mysql = {};

mysql.version = '1';

mysql.conn = {};

mysql.link  = function(config){
    if(typeof config=='string'){
        config = mysql.config[config];
    }
    var id = config.database;
    if(mysql.conn[id]==null){
        mysql.conn[id] = client.create({
            'maxconnections':10
        });
        mysql.conn[id].addserver(config);
    }else{

    }
    return mysql.conn[id];
};


mysql.config = {
    'rds':{
        'host':'rds0y91rwy6n8d3kmu70.mysql.rds.aliyuncs.com',
        'user':'ciweidb',
        'password':'ciweidb2015',
        'database':'message'
    },
    'rds_remote':{
        'host':'rds0y91rwy6n8d3kmu70public.mysql.rds.aliyuncs.com',
        'user':'ciweidb',
        'password':'ciweidb2015',
        'database':'message'
    },
    'rds_r':{
        'host':'rds0yqady2a50voqc3fx.mysql.rds.aliyuncs.com',
        'user':'ciweidb',
        'password':'ciweidb2015',
        'database':'message'
    },
    'rds_r_remote':{
        'host':'rds0yqady2a50voqc3fxpublic.mysql.rds.aliyuncs.com',
        'user':'ciweidb',
        'password':'ciweidb2015',
        'database':'message'
    },
    'dev':{
        'host':'121.41.85.236',
        'user':'ciwei',
        'password':'123456',
        'database':'message'
    },
    'local':{
        'host':'127.0.0.1',
        'user':'ciwei',
        'password':'123456',
        'database':'message'
    }
};



module.exports = mysql;

/**
 * Change Log
 * 1     init
 */
