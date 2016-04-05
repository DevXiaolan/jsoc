/**
 * Created by lanhao on 16/4/5.
 */

var App = function(){
    "use strict";

    this.plans = [];
    this.currentPlan = null;
};

App.prototype.loadPlan = function (cb) {
    var _this = this;
    $.get('/index/plans', function (data) {
        if(data.code == 200) {
            _this.plans = data.data;
            cb && cb(null,null);
        }else{
            //todo
        }
    });
};

App.prototype.loadDetail = function (plan,cb) {
    var _this = this;
    $.get('/index/detail?plan='+plan, function (data) {
        if(data.code == 200) {
            _this.currentPlan = data.data;
            $('#header em').html(_this.currentPlan.host);//todo : as top bar
            _this.sider();
            cb && cb(null,_this.currentPlan);
        }else{
            //todo
        }
    });
};

App.prototype.sider = function () {
    var _this = this;
    var _html = '';
    for(var k in _this.currentPlan.apis){
        _html += '<li class="li-api" data-api="'+k+'"><i class="am-icon-chain am-icon-fw"></i>'+_this.currentPlan.apis[k].name+'</li>';;
    }
    $('#sider ul').html(_html);
};

App.prototype.apiCommon = function (api) {
    var _html = '';
    api = this.currentPlan.apis[api];
    _html += '<div><label>Name:</label><input name="name" value="'+api.name+'"></div>';
    _html += '<div><label>URI:</label><input name="uri" value="'+api.uri+'"></div>';
    _html += '<div><label>METHOD:</label><input placeholder="get / post / put / delete" name=",ethod" value="'+api.method+'"></div>';
    _html += this.apiObject(api.header,'Headers');
    _html += this.apiObject(api.query,'query');
    _html += this.apiObject(api.body,'body');
    _html += this.apiObject(api.return,'return');
    return _html;
};

App.prototype.apiObject = function (obj,title) {
    var _html = '<fieldSet><legend>'+title+'</legend>';
    for(var k in obj){
        _html += this.apiEntity(k,obj[k]);
    }
    return _html+'</fieldSet>';
};

App.prototype.apiEntity = function (key,entity) {
    var _html = '';
    _html +='<label>'+key+':</label><span class="am-icon-edit am-icon-fixed am-text-primary">Edit</span><span class="am-icon-trash am-icon-fixed am-text-warning">Remove</span>';
    var option = ['type','assert','to','from'];
    if(!entity.type && !entity.assert){
        for(var k in entity){
            _html += this.apiEntity(k,entity[k]);
        }
    }else{
        for(var k in entity){
            var _tmp = (''+entity[k]).split(' ');
            _html += '<div class="entity"><label>'+k+':</label>'+'<input name="'+k+'_type" value="'+_tmp[0]+'" readonly>'+(_tmp[1]?'<label>Length:</label><input readonly name="'+k+'_length" value="'+_tmp[1]+'">':'')+'</div>'
        }
    }
    return _html;
};

!function($){

    var blink = function (sl) {
        $(sl).addClass('blink');
        setTimeout(function () {
            $(sl).removeClass('blink');
        },500);
    };
    
    var loading = {
        'delay':400,
        'on': function () {
            $('#board').addClass('am-hide');
            $('#loading').removeClass('am-hide');
        },
        'off': function () {
            setTimeout(function () {
                $('#loading').addClass('am-hide');
                $('#board').removeClass('am-hide');
            },loading.delay);
        }
    };
    
    var prettyJson = function (obj,tabCount) {
        tabCount++;
        if(typeof obj == 'object'){
            var r = '';
            r += (obj.length)?'[\n':'{\n';
            for(var k in obj){
                r += '    '.repeat(tabCount)+k+' : '+prettyJson(obj[k],tabCount);
            }
            return r += '    '.repeat(tabCount-1)+((obj.length)?'],':'},')+'\n';
        }else{
            return obj+',\n';
        }
    };
    
    $('#header').find('ul').get(0).addEventListener('click', function (e) {
        if(e.target.className == 'am-dropdown-header'){
            var plan = e.target.innerHTML;
            loading.on();
            window.app.loadDetail(plan, function (e, r) {
                loading.off();
            });
            $(this).parent().find('button').html(plan).click();
        }
    });
    $('#sider').find('ul').get(0).addEventListener('click', function (e) {
        if(e.target.className == 'li-api'){
            var api = e.target.dataset.api;
            $('#content>div').html(app.apiCommon(api));
        }
    });


    var app = window.app = new App();
    app.loadPlan(function (e, r) {
       var _html = '';
       for(var i = 0;i<app.plans.length;i++){
           _html += '<li class="am-dropdown-header">'+app.plans[i]+'</li>';
       }
       $('#header').find('ul').html(_html);
       setTimeout(function () {
           $('#loading').addClass('am-hide');
           blink('#header .am-btn-fixed');
       },800) ;
    });
}($);
