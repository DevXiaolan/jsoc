'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
        "create_subject": {
            "name": "创建新主题",
            "uri": "/channels",
            "method": "post",
            "header": {
                "content-type": {
                    "_type": "String",
                    "_assert": "application/json",
                    "_choices": ""
                }
            },
            "query": {},
            "body": {
                "alias": {
                    "_type": "String",
                    "_length": "16",
                    "_choices": ""
                },
                "name": {
                    "_type": "String",
                    "_length": "16",
                    "_choices": ""
                },
                "prefix": {
                    "_type": "String",
                    "_length": "16",
                    "_choices": ""
                },
                "description": {
                    "_type": "String",
                    "_length": "128",
                    "_choices": ""
                },
                "tags": {
                    "_type": "Array",
                    "_length": "",
                    "_choices": ""
                },
                "allow_set": {
                    "_type": "Bool"
                },
                "need_verified": {
                    "_type": "Bool"
                },
                "avatar": {
                    "_type": "String",
                    "_length": "256",
                    "_choices": ""
                }
            },
            "return": {
                "id": {
                    "_type": "String",
                    "_length": "64",
                    "_choices": ""
                },
                "alias": {
                    "_type": "String",
                    "_length": "64",
                    "_choices": ""
                },
                "name": {
                    "_type": "String",
                    "_length": "64",
                    "_choices": ""
                },
                "prefix": {
                    "_type": "String",
                    "_length": "64",
                    "_choices": ""
                },
                "description": {
                    "_type": "String",
                    "_length": "128",
                    "_choices": ""
                },
                "tags": {
                    "_type": "Array",
                    "_length": "",
                    "_choices": ""
                },
                "allow_set": {
                    "_type": "Bool"
                },
                "need_verified": {
                    "_type": "Bool"
                },
                "is_subscribed": {
                    "_type": "Bool"
                },
                "avatar": {
                    "large": {
                        "_type": "String",
                        "_length": "128",
                        "_choices": ""
                    },
                    "thumbnail": {
                        "_type": "String",
                        "_length": "128",
                        "_choices": ""
                    }
                },
                "last_message_posted": {
                    "_type": "Number",
                    "_length": "11",
                    "_choices": ""
                },
                "updated": {
                    "_type": "Number",
                    "_length": "11",
                    "_choices": ""
                },
                "created": {
                    "_type": "Number",
                    "_length": "11",
                    "_choices": ""
                }
            }
        }
    }
};
