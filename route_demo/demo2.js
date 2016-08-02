
'use strict';

let route_demo = {};



/**
 * @jsoc
 *   name:test3
 *   desc:a test3 doc
 *   group:test
 *   request
 *     uri:/test/api2/{id}
 *     params
 *       id
 *         _type:number
 *         _required:true
 *     headers
 *       appId:number 10
 *       content-type:application/json
 *     body
 *       name:string 32
 *       password:string 32
 *   response
 *     headers
 *     body
 *       code:200
 *       data:array
 *       message:string 20
 */

module.exports = route_demo;