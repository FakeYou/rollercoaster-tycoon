'use strict';

var jBinary = require('jBinary');

var config = {
	'jBinary.all': 'RLE',
	'jBinary.littleEndian': true,

	RLE: jBinary.Type({
		read: function() {
			var data = [];

			while(this.view.buffer.length - 4 > this.binary.tell()) {
				var flag = this.binary.read('uint8');

				if(flag & 0b10000000) {
					var amount = 0xff - flag + 1;
					var byte = this.binary.read('uint8');

					// console.log('dup', byte, amount);

					for(; amount >= 0; amount--) {
						data.push(byte);
					} 
				}
				else {
					var counter = flag + 1;

					// console.log('read', counter);

					for(; counter > 0; counter--) {
						data.push(this.binary.read('uint8'));
					}
				}
			}

			return data;
		}
	})
}

module.exports = config;