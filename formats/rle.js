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
					for(; amount >= 0; amount--) {
						data.push(byte);
					} 
				}
				else {
					var counter = flag + 1;
					for(; counter > 0; counter--) {
						data.push(this.binary.read('uint8'));
					}
				}
			}

			return data;
		},

		write: function(data) {
			var sequence = [];
			var sequences = [];

			for(var i = 0; i < data.length; i++) {
				if(sequence.length === 0) {
					sequence.push(data[i]);
				}
				else if(sequence[0] === data[i]) {
					sequence.push(data[i]);
					
					if(sequence.length === 125) {
						sequences.push(sequence);
						sequence = [];
					}
				}
				else if(sequence[0] !== data[i]) {
					sequences.push(sequence);
					sequence = [data[i]];
				}
			}

			sequences.push(sequence);

			// console.log(sequences);

			var data = [];

			for(i = 0; i < sequences.length; i++) {
				var sequence = sequences[i];

				if(sequence.length === 1) {
					data.push(sequence[0]);

					if(!sequences[i + 1] || sequences[i + 1].length !== 1) {
						var flag = data.length - 1;
						this.binary.write('uint8', flag);
						this.binary.write(['array', 'uint8'], data);
						data = [];
					}
				}
				else {
					var flag = 0xff - sequence.length + 2;
					this.binary.write('uint8', flag);
					this.binary.write('uint8', sequence[0]);
				}
			}
		}
	})
}

module.exports = config;