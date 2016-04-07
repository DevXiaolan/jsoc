/**
 * Created by lanhao on 16/4/5.
 */

var App = function () {
    "use strict";

    this.plans = [];
    this.currentPlan = null;

    this.vueHeader = new Vue({
        el: '#header',
        data: {
            site:'JSOC.',
            host:'',
            plans: this.plans
        }
    });

    this.vueSider = new Vue({
        el:'#sider',
        data:{
            plan:{}
        }
    });

    this.vueDialog = new Vue({
        el:'#dialog',
        data:{
            entity:{}
        },
        methods:{
            close: function () {
                $('#dialog').hide();
            }
        }
    });
};

App.prototype.loadPlan = function (cb) {
    var _this = this;
    $.get('/index/plans', function (data) {
        if (data.code == 200) {
            _this.plans = data.data;
            cb && cb(null, null);
        } else {
            //todo
        }
    });
};

App.prototype.loadDetail = function (plan, cb) {
    var _this = this;
    $.get('/index/detail?plan=' + plan, function (data) {
        if (data.code == 200) {
            _this.vueSider._data.plan = _this.currentPlan = data.data;
            _this.vueHeader._data.host = _this.currentPlan.host;
            cb && cb(null, _this.currentPlan);
        } else {
            //todo
        }
    });
};


App.prototype.apiCommon = function (api) {
    var _html = '';
    api = this.currentPlan.apis[api];
    _html += '<div><label>Name:</label><input name="name" value="' + api.name + '"> ( API identify name )</div>';
    _html += '<div><label>URI:</label><input name="uri" value="' + api.uri + '"> ( HTTP request URI )</div>';
    _html += '<div><label>METHOD:</label><input placeholder="get / post / put / delete" name=",ethod" value="' + api.method + '"> ( HTTP request method : [ get , post , put , delete ] )</div>';
    _html += this.apiObject(api.header, 'Headers');
    _html += this.apiObject(api.query, 'query');
    _html += this.apiObject(api.body, 'body');
    _html += this.apiObject(api.return, 'return');
    return _html;
};

App.prototype.apiObject = function (obj, title) {
    var _html = '<fieldSet><legend>' + title + '<span data-dialog="d_add_entity" class="am-icon-plus-square am-icon-fixed am-text-success">Add</span></legend>';
    for (var k in obj) {
        _html += this.apiEntity(k, obj[k]);
    }
    return _html + '</fieldSet>';
};



App.prototype.apiEntity = function (key, entity) {
    var _html = '';
    if (!entity.type && !entity.assert) {

        _html += '<section class="entity"><label>' + key + ':</label><span data-dialog="d_add_entity" class="am-icon-plus-square am-icon-fixed am-text-success">Add</span>';
        for (var k in entity) {
            _html += this.apiEntity(k, entity[k]);
        }
    } else {
        var _source = {};
        _source[key] = entity;
        _html += '<section class="entity"><label>' + key + ':</label><span data-s=\''+JSON.stringify(_source)+'\' data-dialog="d_edit_entity" class="am-icon-edit am-icon-fixed am-text-primary">Edit</span><span class="am-icon-trash am-icon-fixed am-text-warning">Remove</span>';
        for (var k in entity) {
            var _tmp = ('' + entity[k]).split(' ');
            _html += '<div class="option"><label>' + k + ':</label>' + '<input name="' + k + '_type" value="' + _tmp[0] + '" readonly>' + (_tmp[1] ? '<label>Length:</label><input readonly name="' + k + '_length" value="' + _tmp[1] + '">' : '') + '</div>'
        }
    }
    return _html+'</section>';
};

App.prototype.dialog = function (caller,type, cb) {
    console.log(type);
    switch(type){
        case 'd_add_entity':
            this.vueDialog._data.entity = {};
            break;
        case 'd_edit_entity':
            var s = $(caller).data('s');
            this.vueDialog._data.entity = s;
            break;
        default :
            break;
    }
    cb && cb(null,this.vueDialog._data.entity);
};

!function ($) {

    var blink = function (sl) {
        $(sl).addClass('blink');
        setTimeout(function () {
            $(sl).removeClass('blink');
        }, 500);
    };

    var loading = {
        'delay': 400,
        'on': function () {
            $('#board').addClass('am-hide');
            $('#loading').removeClass('am-hide');
        },
        'off': function () {
            setTimeout(function () {
                $('#loading').addClass('am-hide');
                $('#board').removeClass('am-hide');
            }, loading.delay);
        }
    };

    var prettyJson = function (obj, tabCount) {
        tabCount++;
        if (typeof obj == 'object') {
            var r = '';
            r += (obj.length) ? '[\n' : '{\n';
            for (var k in obj) {
                r += '    '.repeat(tabCount) + k + ' : ' + prettyJson(obj[k], tabCount);
            }
            return r += '    '.repeat(tabCount - 1) + ((obj.length) ? '],' : '},') + '\n';
        } else {
            return obj + ',\n';
        }
    };

    $('#header').find('ul').get(0).addEventListener('click', function (e) {
        if (e.target.className == 'am-dropdown-header') {
            var plan = e.target.innerHTML;
            loading.on();
            window.app.loadDetail(plan, function (e, r) {
                loading.off();
            });
            $(this).parent().find('button').html(plan).click();
        }
    });
    $('#sider').find('ul').get(0).addEventListener('click', function (e) {
        if (e.target.className == 'li-api') {
            var api = e.target.dataset.api;
            $('#content>div').html(app.apiCommon(api));
        }
    });

    $('#content').get(0).addEventListener('click', function (e) {

        var dialog = e.target.dataset.dialog;
        if(dialog){
            console.log('has dialog');
            $('#dialog').hide().css({
                top:(e.pageY-160)+'px',
                left:(e.pageX-100)+'px'
            });
            app.dialog(e.target,dialog,function(e,r){
                console.log(e,r);
                $('#dialog').show();
            });
        }else{
            console.log('no dialog');
        }
    });



    var app = window.app = new App();

    app.loadPlan(function (e, r) {
        app.vueHeader._data.plans = app.plans;
        setTimeout(function () {
            $('#loading').addClass('am-hide');
            blink('#header .am-btn-fixed');
        }, 800);
    });

}($);
