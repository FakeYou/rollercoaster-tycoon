'use strict';

var fs = require('fs');
var path = require('path');
var jBinary = require('jBinary');

var TD6Format = require('../formats/td6');

var loadTD6 = function(TD6Path, callback) {
	console.log(TD6Path);

	jBinary.load(TD6Path, TD6Format, function(err, jb) {
		if(err) {
			return callback(err);
		}

		var TD6;

		try {
			TD6 = jb.readAll();
		}
		catch(e) {
			return callback(e);
		}

		callback(null, TD6);
	})
}

loadTD6(path.resolve(__dirname, '../temp/test.TD6'), function(err, result) {
	if(err) {
		return console.error(err);
	}

	console.log(result);
});