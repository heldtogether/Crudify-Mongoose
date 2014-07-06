express-mongoose-crud
============

Simple generator to create RESTful url routes, render forms and handle Create, Read, Update and Delete requests for a given Mongoose model

## Install

```
TBC
```

## RESTful routes

Generate RESTful url routes for the Mongoose model supplied.
You should use the pluralized name of the model in place of
`{resources}`. 

```js
module.exports = mongoose.model('user', userSchema); // {resources} == 'users'
```

URL routes:

- GET /{resources}/
- GET /{resources}/create/
- POST /{resources}/
- GET /{resources}/{id}/
- GET /{resources}/{id}/edit/
- PUT /{resources}/{id}/
- DELETE /{resources}/{id}/

## Usage

```js
/**
 * @param {Object} options
 * @param {Object} options.model
 *		- A Mongoose model of the resource you want 
 *        to CRUDify.
 * @param {String} [options.theme] 
 *		- The locacation of the views to render. 
 *        There are default forms which require your 
 *        app to use EJS view engine.
 * @param {Array} [options.middleware]
 *		- An array of middleware you want to use for 
 *        each route. You can add authentication in 
 *        this way (none is used by default).
 * @param {Array} [options.ignoredProperties] 
 *		- The model properties which you don't want 
 *        to see. By default this list is ['_id', '__v'].
 */

crudGenerator(options);
```

## Example

```js
var crudGenerator = require('./library/crud-generator');
var userModel = require('./model/user');

/**
 * Generate routes and controller methods
 * for the users resources:
 *     - GET /admin/users/
 *     - GET /admin/users/create/
 *     - POST /admin/users/
 *     - GET /admin/users/{id}/
 *     - GET /admin/users/{id}/edit/
 *     - PUT /admin/users/{id}/
 *     - DELETE /admin/users/{id}/
 */
app.use('/admin', crudGenerator({
	model: userModel,
	middleware: [
		function (res, req, next){
			console.log('middle');
			next();
		}
	],
	ignoredProperties: ['__v', '_id', 'modifiedAt']
}));
```

## License

(The MIT License)