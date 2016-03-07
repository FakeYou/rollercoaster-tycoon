'use strict';

var jBinary = require('jBinary');
var UINT32 = require('cuint').UINT32;

var config = {
	'jBinary.all': 'checksum',
	'jBinary.littleEndian': true,

	checksum: jBinary.Type({
		read: function() {
			return this.binary.read(['array', 'uint8', 4]);
		},

		write: function(data) {
			let summation = UINT32(0);

			for(var i = 0; i < data.length; i++) {
				let byte = data[i];

				let temp = summation.clone().add(UINT32(byte));
				summation = UINT32(summation.toNumber() & 0xffffff00 | temp.toNumber() & 0x000000ff);
				summation.rotateLeft(3);
			}

			summation.subtract(UINT32(120001));
			summation = summation.toNumber();

			this.binary.write('uint8', (summation & 0xff) >> 0);
			this.binary.write('uint8', (summation & 0xff00) >> 8);
			this.binary.write('uint8', (summation & 0xff0000) >> 16);
			this.binary.write('uint8', (summation & 0xff000000) >> 24);
		}
	})
}

module.exports = config;