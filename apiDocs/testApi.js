'use strict';
module.exports = {
    host : 'http://127.0.0.1:3001',
    apis : {
        user : {
            name : 'user',
            uri : '/test/user/{uid}',
            method : 'get',
            header : {
                appId : {
                    type : 'Number',
                    length : 6
                },
                token : {
                    type : 'String',
                    name : 'token',
                    length : 12
                }
            },
            query : {
                time : {
                    type : 'Number',
                    length : 10
                }
            },
            body : {
            },
            return : {
                code : {
                    type : 'Number',
                    assert : 200
                },
                data : {
                    uid : {
                        type : 'Number',
                        length : 10,
                        to : 'temp_uid'
                    },
                    profile : {
                        tel : {
                            type : 'Number',
                            length : 11
                        },
                        email : {
                            type : 'Email'
                        },
                        address : {
                            type : 'String',
                            name : 'address'
                        }
                    }
                },
                msg : {
                    type : 'String'
                }
            }
        },
        order : {
            name : 'order',
            uri : '/test/order',
            method : 'get',
            header : {
            },
            query : {
            },
            body : {
            },
            return : {
                code : {
                    type : 'Number',
                    assert : 200
                },
                data : {
                    type : 'Array'
                },
                msg : {
                    type : 'String'
                }
            }
        }
    }
};
