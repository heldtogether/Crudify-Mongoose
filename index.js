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

var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var pluralize = require('pluralize');


var CrudGenerator = function (options){

	var defaultOptions = {
		theme: __dirname+'/theme/',
		ignoredProperties: ['__v', '_id']
	};

	_.defaults(options, defaultOptions);

	this.options = options;
	this.model = options.model;
	this.modelName = options.model.modelName;
	this.routeStem = '/'+pluralize(this.modelName);

};


/*
 * @method app
 */
CrudGenerator.prototype.app = function (){

	var app = express();

	app.get(
		this.routeStem,
		this.options.middleware,
		this.listResources.bind(this)
	);
	app.get(
		this.routeStem+'/create',
		this.options.middleware,
		this.createResource.bind(this)
	);
	app.post(
		this.routeStem,
		this.options.middleware,
		this.storeResource.bind(this)
	);
	app.get(
		this.routeStem+'/:id',
		this.options.middleware,
		this.getResource.bind(this)
	);
	app.get(
		this.routeStem+'/:id/edit',
		this.options.middleware,
		this.editResource.bind(this)
	);
	app.put(
		this.routeStem+'/:id',
		this.options.middleware,
		this.updateResource.bind(this)
	);
	app.del(
		this.routeStem+'/:id',
		this.options.middleware,
		this.deleteResource.bind(this)
	);

	return app;

};


/*
 * @method getProperties
 */
CrudGenerator.prototype.getProperties = function(){
	var properties = [];
	for(var property in this.model.schema.paths){
		if(this.options.ignoredProperties.indexOf(property) < 0){
			properties.push(property);
		}
	}
	properties.sort();
	return properties;
};


/*
 * @method listResources
 */
CrudGenerator.prototype.listResources = function(req, res){
	var $self = this;
	this.model
	.find()
	.exec(function (err, resources){
		res.locals.properties = $self.getProperties();
		res.locals.resources = resources;
		res.render($self.options.theme+'list.ejs');
	});
};


/*
 * @method createResource
 */
CrudGenerator.prototype.createResource = function(req, res){
	console.log('create');
};


/*
 * @method storeResource
 */
CrudGenerator.prototype.storeResource = function(req, res){
	console.log('store');
};


/*
 * @method getResource
 */
CrudGenerator.prototype.getResource = function(req, res){
	console.log('get');
};


/*
 * @method editResource
 */
CrudGenerator.prototype.editResource = function(req, res){
	console.log('edit');
};


/*
 * @method updateResource
 */
CrudGenerator.prototype.updateResource = function(req, res){
	console.log('update');
};


/*
 * @method deleteResource
 */
CrudGenerator.prototype.deleteResource = function(req, res){
	console.log('delete');
};

module.exports = function (options){
	var g = new CrudGenerator(options);
	return g.app();
};