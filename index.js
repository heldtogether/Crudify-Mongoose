/*
 *
 * GET /resources
 * GET /resources/create
 * POST /resources
 * GET /resources/{resource}
 * GET /resources/{resource}/edit
 * PUT /resources/{resource}
 * DELETE /resources/{resource}
 */

/**
 * Creates 7 RESTful routes for listing, 
 * creating, storing, getting, editing,
 * updating and deleting Mongoose models.
 *
 * @class CrudGenerator
 * @param {Object} options
 * @param {Object} options.model
 * @param {Array} [options.middleware]
 * @return {Object} Express app
 */

var express = require('express');
var mongoose = require('mongoose');
var pluralize = require('pluralize');

var CrudGenerator = function (options){

	var model = options.model;
	var modelName = options.model.modelName;
	var routeStem = '/'+pluralize(modelName);

	var app = express();

	app.get(routeStem, options.middleware, listResources);
	app.get(routeStem+'/create', options.middleware, createResource);
	app.post(routeStem, options.middleware, storeResource);
	app.get(routeStem+'/:id', options.middleware, getResource);
	app.get(routeStem+'/:id/edit', options.middleware, editResource);
	app.put(routeStem+'/:id', options.middleware, updateResource);
	app.del(routeStem+'/:id', options.middleware, deleteResource);

	return app;

}


/*
 * @method listResources
 */
function listResources(req, res){
	console.log('list');
}


/*
 * @method createResource
 */
function createResource(req, res){
	console.log('create');
}


/*
 * @method storeResource
 */
function storeResource(req, res){
	console.log('store');
}


/*
 * @method getResource
 */
function getResource(req, res){
	console.log('get');
}


/*
 * @method editResource
 */
function editResource(req, res){
	console.log('edit');
}


/*
 * @method updateResource
 */
function updateResource(req, res){
	console.log('update');
}


/*
 * @method deleteResource
 */
function deleteResource(req, res){
	console.log('delete');
}

module.exports = CrudGenerator;