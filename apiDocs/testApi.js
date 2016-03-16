'use strict';

module.exports = {
    'host': 'http://127.0.0.1:3001',
    'apis': {
        'profile': {
            name: 'profile',
            uri: '/user/profile',
            method: 'get',
            header: {
                appid: {
                    type: 'String'
                }
            }
            ,
            body: {
                userId: {
                    'type': 'Number',
                    'from': 't_uid'
                }
            }
            ,
            return: {
                code: {
                    type: 'Number',
                    assert: 200
                }
                ,
                data: {
                    type:'Object'
                }
                ,
                msg: {
                    type: 'String'
                }
            }
        },
        'index': {
            name: 'index',
            uri: '/index/index',
            method: 'get',
            header: {
                appid: {
                    type: 'String'
                }
            }
            ,
            body: {
            }
            ,
            return: {
                code: {
                    type: 'Number',
                    assert: 200
                }
                ,
                data: {
                    type:'Object'
                }
                ,
                msg: {
                    type: 'String'
                }
            }
        }
    }
};
