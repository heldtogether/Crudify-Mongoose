var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');
var pluralize = require('pluralize');

/**
 * Creates 7 RESTful routes for listing, 
 * creating, storing, getting, editing,
 * updating and deleting Mongoose models.
 *
 * @class CrudGenerator
 * @param {Object} options
 * @param {Object} options.model
 * @param {String} [options.theme]
 * @param {Array} [options.middleware]
 * @param {Array} [options.overviewProperties]
 * @param {Array} [options.ignoredProperties]
 */
var CrudGenerator = function (options){

	var defaultOptions = {
		theme: __dirname+'/theme',
		ignoredProperties: ['__v', '_id'],
		overviewProperties: [],
		query: {}
	};

	_.defaults(options, defaultOptions);

	/*
	 * @property options
	 * @type Object
	 * @default {
	 *	theme: __dirname+'/theme/',
	 *	ignoredProperties: ['__v', '_id'],
	 *	overviewProperties: []
	 * }
	 */
	this.options = options;

	/*
	 * @property model
	 * @type Object
	 */
	this.model = options.model;

	/*
	 * @property modelName
	 * @type String
	 */
	this.modelName = options.model.modelName;

	/*
	 * @property routeStem
	 * @type String
	 */
	this.routeStem = pluralize(this.modelName);

	/*
	 * @property method
	 * @type String
	 */
	this.method;

};


/*
 * Creates an Express app with the RESTful
 * routes.
 *
 * @method app
 * @return {Object} Express app
 */
CrudGenerator.prototype.app = function (){

	var app = express();

	app.use(function (req, res, next){
		if(req.url.substr(-1) != '/'){
			res.redirect(301, req.originalUrl+'/');
		} else {
			next();
		}
	});

	/*
	 * GET /{resources}/
	 */
	app.get(
		'/'+this.routeStem+'/',
		this.options.middleware,
		this.listResources.bind(this)
	);
	/*
	 * GET /{resources}/create/
	 */
	app.get(
		'/'+this.routeStem+'/create/',
		this.options.middleware,
		this.createResource.bind(this)
	);
	/*
	 * POST /{resources}/
	 */
	app.post(
		'/'+this.routeStem+'/',
		this.options.middleware,
		this.storeResource.bind(this)
	);
	/*
	 * GET /{resources}/{id}/
	 */
	app.get(
		'/'+this.routeStem+'/:id/',
		this.options.middleware,
		this.getResource.bind(this)
	);
	/*
	 * GET /{resources}/{id}/edit/
	 */
	app.get(
		'/'+this.routeStem+'/:id/edit/',
		this.options.middleware,
		this.editResource.bind(this)
	);
	/*
	 * PUT /{resources}/{id}/
	 */
	app.put(
		'/'+this.routeStem+'/:id/',
		this.options.middleware,
		this.updateResource.bind(this)
	);
	/*
	 * DELETE /{resources}/{id}/
	 */
	app.del(
		'/'+this.routeStem+'/:id/',
		this.options.middleware,
		this.deleteResource.bind(this)
	);

	return app;

};


/*
 * Returns a list of the model properties,
 * not including those on the ignoredProperties
 * list. By default this includes _id and __v
 * as these are generate by Mongo.
 * 
 * @method getProperties
 * @return {Array} Array of the model properties
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
 * Handle a 'list' request, rendering a page
 * with table of all of the existing resources.
 *
 * @method listResources
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.listResources = function(req, res){
	this.method = 'list';
	var $self = this;
	this.model
	.find($self.options.query)
	.exec(function (err, resources){
		res.locals.settings = $self;
		res.locals.properties = $self.getProperties();
		res.locals.resources = resources;
		res.render($self.options.theme+'/list.ejs');
	});
};


 /*
 * Handle a 'create' request, rendering a page
 * with an empty form with all the model
 * properties.
 *
 * @method createResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.createResource = function(req, res){
	this.method = 'create';
	res.locals.settings = this;
	res.locals.properties = this.getProperties();
	res.render(this.options.theme+'/create.ejs');
};


/*
 * Handle a 'store' request, saving the new
 * resource and redirecting to the 'get' 
 * method for the new resource.
 *
 * @method storeResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.storeResource = function(req, res){
	this.method = 'store';
	var $self = this;
	var properties = this.getProperties();
	var resource = new this.model();
	properties.forEach(function(property){
		if($self.options.query[property]){
			resource[property] = $self.options.query[property];
		} else if(req.param(property)){
			resource[property] = req.param(property);
		}
	});
	resource.save(function (err, resource){
		if(err){
			console.log(err);
		}
		res.redirect($self.routeStem+'/'+resource._id);
	});
};


/*
 * Handle a 'get' request, retrieving the
 * specified resouce and rendering a page
 * listing its properties.
 *
 * @method getResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.getResource = function(req, res){
	this.method = 'get';
	var $self = this;
	this.model
	.findOne({_id: req.param('id')})
	.exec(function (err, resource){
		res.locals.settings = $self;
		res.locals.properties = $self.getProperties();
		res.locals.resource = resource;
		res.render($self.options.theme+'/get.ejs');
	});
};


/*
 * Handle an 'edit' request, retrieving the
 * specified resouce and rendering a page
 * with a form to edit its properties.
 *
 * @method editResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.editResource = function(req, res){
	this.method = 'edit';
	var $self = this;
	this.model
	.findOne({_id: req.param('id')})
	.exec(function (err, resource){
		res.locals.settings = $self;
		res.locals.properties = $self.getProperties();
		res.locals.resource = resource;
		res.render($self.options.theme+'/edit.ejs');
	});
};


/*
 * Handle an 'update' request, retrieving the
 * specified resouce, updating its properties
 * and redirecting to the 'get' method for the
 * resource.
 *
 * @method getResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.updateResource = function(req, res){
	this.method = 'update';
	var $self = this;
	var properties = this.getProperties();
	this.model
	.findOne({_id: req.param('id')})
	.exec(function (err, resource){
		properties.forEach(function(property){
			if(req.param(property)){
				resource[property] = req.param(property);
			}
		});
		resource.save(function (err, resource){
			if(err){
				console.log(err);
			}
			res.redirect($self.routeStem+'/'+resource._id);
		});
	});
};


/*
 * Handle a 'delete' request, retrieving the
 * specified resouce and removing it entirely
 * before redirecting to the 'list' method for
 * the model.
 *
 * @method deleteResource
 * @param {Request} req
 * @param {Response} res
 */
CrudGenerator.prototype.deleteResource = function(req, res){
	this.method = 'delete';
	var $self = this;
	this.model
	.findOneAndRemove({_id: req.param('id')})
	.exec(function (err, resource){
		res.redirect($self.routeStem);
	});
};

module.exports = function (options){
	var g = new CrudGenerator(options);
	return g.app();
};