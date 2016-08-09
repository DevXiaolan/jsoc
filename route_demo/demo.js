
'use strict';

let route_demo = {};

/**
 * @jsoc.host http://127.0.0.1:3001
 */

/**
 * @jsoc
 *   name:api1
 *   desc:a demo doc
 *   group:test
 *   request
 *     method:get
 *     uri:/demo/{id}
 *     params
 *       id
 *         _type:number
 *         _required:true
 *     query
 *       page
 *         _type:number
 *         _default:1
 *         _from:pageNum
 *   response
 *     body
 *       code
 *         _type:number
 *         _assert:200
 *       data
 *         _type:object
 *       message
 *         _type:string
 *         _required:false
 */


module.exports = route_demo;