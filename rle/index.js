'use strict';

var fs = require('fs');
var path = require('path');
var jBinary = require('jBinary');

var RLEFormat = require('../formats/rle');

var loadRLE = function(RLEPath, callback) {
	console.log(RLEPath);

	jBinary.load(RLEPath, RLEFormat, function(err, jb) {
		if(err) {
			return callback(err);
		}

		var RLE;

		try {
			RLE = jb.readAll();
		}
		catch(e) {
			return callback(e);
		}

		callback(null, RLE);
	})
}

loadRLE(path.resolve(__dirname, '../resources/tracks/wooden-simple.TD4'), function(err, result) {
	if(err) {
		return console.error(err);
	}

	var buffer = new Buffer(result);

	fs.writeFileSync(path.resolve(__dirname, '../temp/wooden-simple.TD4'), buffer, 'binary');
});