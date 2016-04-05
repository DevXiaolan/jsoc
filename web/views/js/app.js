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
            $('#header em').html(_this.currentPlan.host);
            cb && cb(null,_this.currentPlan);
        }else{
            //todo
        }
    });
};

!function($){

    var blink = function (sl) {
        $(sl).addClass('blink');
        setTimeout(function () {
            $(sl).removeClass('blink');
        },500);
    };

    $('#header').find('ul').get(0).addEventListener('click', function (e) {
        if(e.target.className == 'am-dropdown-header'){
            var plan = e.target.innerHTML;
            $('#loading').removeClass('am-hide');
            window.app.loadDetail(plan, function (e, r) {
                $('#loading').addClass('am-hide');
                $('#board').removeClass('am-hide');
            });
            $(this).parent().find('button').html(plan).click();
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
       },1000) ;
    });
}($);
