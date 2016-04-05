/**
 * Created by lanhao on 16/4/5.
 */

var App = function($){
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
            $('#content>div').html('<pre>'+prettyJson(app.currentPlan.apis[api],0)+'</pre>');
        }
    });

    var app = window.app = new App($);
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
