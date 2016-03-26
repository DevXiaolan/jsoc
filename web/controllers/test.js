/**
 * Created by lanhao on 15/5/17.
 */



var Controller = {};

Controller.index = function (req,res) {
    res.end('hello');
};

Controller.user = function(req,res){
    res.json(200,{
        'user':'little blue'+req.body.userId
    },'ok');
};

Controller.order = function(req,res){
    res.json(200,[
            {'orderId':11}
        ]
    ,'ok');
}

module.exports = Controller;