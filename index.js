'use strict';
var resolve = require('resolve');
var FIREBASE_PATH = require.resolve('firebase');
var FIRBASE_DIR = require('path').dirname(FIREBASE_PATH);
var contents = require('fs').readFileSync(FIREBASE_PATH);

var create = new Function('module', 'require', contents); // eslint-disable-line no-new-func

function altRequire(path) {
	try {
		path = resolve.sync(path, {basedir: FIRBASE_DIR});
	} catch (e) {}
	return require(path); // eslint-disable-line global-require
}

module.exports = function () {
	var module = {exports: {}};
	create(module, altRequire);
	return module.exports;
};
