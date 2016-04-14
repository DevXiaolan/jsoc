/**
 * Created by lanhao on 16/4/5.
 */

var App = function () {
    "use strict";

    this.plans = [];
    this.currentPlan = null;
    this.currentPlanName = null;
    this.currentApi = null;
    this.vueHeader = new Vue({
        el: '#header',
        data: {
            site:'JSOC.',
            host:{},
            plans: this.plans
        }
    });

    this.vueContentHead = new Vue({
        el:'#content',
        data:{
            api:{}
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
            _this.currentPlanName = plan;
            _this.vueHeader._data.host = _this.currentPlan;
            cb && cb(null, _this.currentPlan);
        } else {
            //todo
        }
    });
};


App.prototype.apiCommon = function (api) {
    var _html = '';
    api = this.currentPlan.apis[api];
    _html += this.apiHead(api);
    _html += this.apiObject(api.header, 'header');
    _html += this.apiObject(api.query, 'query');
    _html += this.apiObject(api.body, 'body');
    _html += this.apiObject(api.return, 'return');
    return _html;
};

App.prototype.apiHead = function (api) {
    var _html = '';
    _html += '<div><label>Name:</label><input role="name" class="apiHead" name="name" value="' + api.name + '"> ( API identify name )</div>';
    _html += '<div><label>URI:</label><input role="uri" class="apiHead" name="uri" value="' + api.uri + '"> ( HTTP request URI )</div>';
    _html += '<div><label>METHOD:</label><input role="method" class="apiHead" placeholder="get / post / put / delete" name="method" value="' + api.method + '"> ( HTTP request method : [ get , post , put , delete ] )</div>';
    return _html;
};

App.prototype.apiObject = function (obj, title) {
    var _source = {
        'entity':{},
        'role':title,
        'isNew':true
    };
    var _html = '<fieldSet role="'+title+'"><legend>' + title + '<span data-s=\''+JSON.stringify(_source)+'\' data-dialog="d_add_entity" class="am-icon-plus-square am-icon-fixed am-text-success">Add</span></legend>';
    for (var k in obj) {
        _html += this.apiEntity(k, obj[k],title);
    }
    return _html + '</fieldSet>';
};



App.prototype.apiEntity = function (key, entity,prefix,feedBack) {
    if(feedBack){

        var arr = prefix.split('.');
        arr.push(key);
        this.feedBack(arr,entity);
    }
    var _html = '';
    if (!feedBack && !(entity.assert || entity.length || entity.to || entity.from || entity.type)) {
        var _source = {
            'entity':{},
            'role':prefix+'.'+key,
            'isNew':true
        };
        _html += '<section class="entity" role="'+_source.role+'"><label>' + key + ':</label><span data-s=\''+JSON.stringify(_source)+'\' data-dialog="d_add_entity" class="am-icon-plus-square am-icon-fixed am-text-success">Add</span>';
        for (var k in entity) {
            _html += this.apiEntity(k, entity[k],prefix+'.'+key);
        }
    } else {
        var _source = {
            'entity':entity
        };
        _source['role'] = prefix+'.'+key;
        _source['name'] = key;
        _html += '<section class="entity"  role="'+prefix+'.'+key+'"><label>' + key + ':</label><span data-s=\''+JSON.stringify(_source)+'\' data-dialog="d_edit_entity" class="am-icon-edit am-icon-fixed am-text-primary">Edit</span><span class="am-icon-trash am-icon-fixed am-text-warning">Remove</span>';
        for (var k in entity) {
            if(k=='role')continue;
            _html += '<div class="option"><label>' + k + ':</label>' + '<span class="option-value">'+entity[k]+'</span></div>'
        }
    }
    return _html+'</section>';
};

App.prototype.dialog = function (caller,type, cb) {
    console.log(type);
    switch(type){
        case 'd_add_entity':
            var s = $(caller).data('s');
            s.entity.type = 'String'
            this.vueDialog._data.entity = s;
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

App.prototype.feedBack = function (arr, data) {
    if(data.type && data.type=='Number' && data.assert){
        data.assert = 1 * data.assert;
    }
    var api = this.currentPlan.apis[this.currentApi];
    while(arr.length>1){
        var _k = arr.shift();
        api = api[_k];
    }
    api[arr[0]] = data;
};

!function ($) {

    var blink = function (sl) {
        $(sl).addClass('blink');
        setTimeout(function () {
            $(sl).removeClass('blink');
        }, 500);
    };

    var loading = {
        'delay': 300,
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


    $('#header').find('ul').get(0).addEventListener('click', function (e) {
        if ($(e.target).hasClass('plan')) {
            var plan = e.target.innerHTML;
            loading.on();
            window.app.loadDetail(plan, function (e, r) {
                loading.off();
            });
            $(this).parent().find('button').html(plan).click();
        }else{
            var key = prompt('请输入接口标识名(英文key)');
            if(/[a-z]+/.test(key)){
                app.plans.push(key);
                app.currentPlanName = key;

            }else{
                alert('请使用小写字母命名');
            }
        }
    });
    $('#sider').find('ul').get(0).addEventListener('click', function (e) {
        if (e.target.className == 'li-api') {
            var api = e.target.dataset.api;
            app.currentApi = api;
            app.vueContentHead._data.api = app.currentPlan.apis[api];
            $('#content>section').removeClass('am-hide');
            $('#content>div').html(app.apiCommon(api));
        }else{
            var key = prompt('请输入接口标识名(英文key)');
            if(/[a-z]+/.test(key)){

                app.currentPlan.apis[key] = {
                    'name':key,
                    'uri':'',
                    'method':'get',
                    'header':{},
                    'query':{},
                    'body':{},
                    'return':{}
                };
                app.vueSider.plan = app.currentPlan;
                $(e.target).before('<li class="li-api" data-api="'+key+'"><i class="am-icon-chain am-icon-fw"></i>'+key+'</li>');
            }else{
                alert('请使用小写字母命名');
            }
        }
    });
    
    
    
    $('#content>div').get(0).addEventListener('click', function (e) {

        var dialog = e.target.dataset.dialog;
        if(dialog){
            $('#dialog').hide().css({
                top:(e.pageY-180)+'px',
                left:(e.pageX-120)+'px'
            });
            //根据 target 给dialog绑定数据（vue）
            app.dialog(e.target,dialog,function(e,r){
                $('#dialog').show();
            });
        }else if($(e.target).hasClass('am-text-warning')){
            var parent = $(e.target).parent();
            var role = parent.attr('role');
            var roleArr = role.split('.');
            var _p = app.currentPlan.apis[app.currentApi];
            while(roleArr.length>1){
                _p = _p[roleArr.shift()];
            }
            delete _p[roleArr[0]];
            parent.remove();
        }
        else{
            //console.log('no dialog');
        }
    });

    $('#dialog').get(0).addEventListener('click', function (e) {
        if (e.target.localName == 'a') {
            var _text = $(e.target).text();
            var op = $(e.target).parent().parent().data('op');
            $(e.target).parent().parent().parent().find('button').text(_text).click();
            app.vueDialog._data.entity.entity[op] = _text;
        }
    });

    $('#dialog_save_btn').click(function (e) {
        var role = app.vueDialog._data.entity.role;
        if(app.vueDialog._data.entity.isNew){
            role += '.'+app.vueDialog._data.entity.name;
        }

        if(role && app.vueDialog._data.entity.name){
            var _tmp = role.split('.');
            var key = _tmp.pop();
            var prefix = _tmp.join('.');
            if(app.vueDialog._data.entity.isNew){
                $('fieldset[role="' + prefix + '"],section[role="' + prefix + '"]').append(app.apiEntity(key, app.vueDialog._data.entity.entity, prefix, true));
            }else {
                $('section[role="' + role + '"]').prop('outerHTML', app.apiEntity(key, app.vueDialog._data.entity.entity, prefix, true));
            }
        }

        app.vueDialog.close();

    });

    $('#content>section').find('button').click(function (e) {
        var cmd = $(e.target).attr('role');
        console.log(cmd);
        switch (cmd){
            case 'cmd_save':
                $.post('/index/savePlan',{
                    name:app.currentPlanName,
                    plan:JSON.stringify(app.currentPlan)
                }, function (data) {
                    console.log(data);
                },'json');
                break;
            case 'cmd_run':

                break;
        }
    });

    $('#content>div').get(0).addEventListener('change', function (e) {
        if(e.target.className=='apiHead'){
            var role = $(e.target).attr('role');
            var value = $(e.target).val();
            app.currentPlan.apis[app.currentApi][role] = value;
        }
    });

    // App start
    if(!window.app) {
        window.app = new App();
        app.loadPlan(function (e, r) {
            app.vueHeader._data.plans = app.plans;
            setTimeout(function () {
                $('#loading').addClass('am-hide');
                blink('#header .am-btn-fixed');
            }, 500);
        });
    }
}($);
