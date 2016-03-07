'use strict';

var fs = require('fs');
var path = require('path');
var jBinary = require('jBinary');

var RLEFormat = require('../formats/rle');
var ChecksumFormat = require('../formats/checksum');

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

loadRLE(path.resolve(__dirname, '../resources/tracks/wooden-simple-elevation.td6'), function(err, result) {
	if(err) {
		return console.log(err);
	}

	var jbin = new jBinary(256*256, RLEFormat);
	jbin.writeAll(result);

	for(var i = jbin.view.buffer.length -1 ; i > 0; i--) {
		if(jbin.view.buffer[i] !== 0) {
			break;
		}
	}

	i += 2;

	var buffer = new Buffer(i);
	buffer.fill(0);
	jbin.view.buffer.copy(buffer, 0, 0, i);

	var checksum = new jBinary(4, ChecksumFormat);
	checksum.writeAll(buffer);

	console.log(i + 4);

	var final = new Buffer(i + 4);
	final.fill(0);
	buffer.copy(final)
	console.log(final);
	checksum.view.buffer.copy(final, i);

	console.log(checksum);

	fs.writeFileSync(path.resolve(__dirname, '../temp/mod.td6'), final, 'binary');
});