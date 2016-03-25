'use strict';

module.exports = {
    'host': 'http://127.0.0.1:3001',
    'apis': {
        'user': {
            name: 'user',
            uri: '/test/user',
            method: 'get',
            header: {
            },
            body: {
                userId: {
                    'type': 'Number 2'
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
        'order': {
            name: 'order',
            uri: '/test/order',
            method: 'get',
            header: {

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
                    type:'Array'
                }
                ,
                msg: {
                    type: 'String'
                }
            }
        }
    }
};
