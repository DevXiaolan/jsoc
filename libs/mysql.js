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
