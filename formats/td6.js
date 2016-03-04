'use strict';

// based on: http://freerct.github.io/RCTTechDepot-Archive/TD6.html

var jBinary = require('jBinary');

var config = {
	'jBinary.all': 'TD6',
	'jBinary.littleEndian': true,

	TD6: jBinary.Type({
		read: function() {
			var byte;
			var data = {};

			data.trackType = this.binary.read('uint8');

			// unknown
			this.binary.skip(1);

			// special track pieces flags
			this.binary.skip(4);

			data.operatingMode = this.binary.read('uint8');

			// vehicle color scheme
			this.binary.skip(1);
			this.binary.skip(32 * 2);

			// unknown
			this.binary.skip(1);

			data.entranceStyle = this.binary.read('uint8');
			data.airTime = this.binary.read('uint8');
			data.departureControlFlags = this.binary.read('uint8');
			data.numTrains = this.binary.read('uint8');
			data.numCarsPerTrain = this.binary.read('uint8');
			data.minWait = this.binary.read('uint8');
			data.maxWait = this.binary.read('uint8');
			data.speed = this.binary.read('uint8') * 3.616;
			data.maxSpeed = this.binary.read('uint8') * 3.616;
			data.averageSpeed = this.binary.read('uint8') * 3.616;
			data.length = this.binary.read('uint16');
			data.positiveGForce = this.binary.read('uint8');
			data.negativeGForce = this.binary.read('uint8');
			data.lateralGForce = this.binary.read('uint8');
			data.numInversions = this.binary.read('uint8');
			data.numDrops = this.binary.read('uint8');
			data.highestDrop = this.binary.read('uint8');
			data.excitement = this.binary.read('uint8');
			data.intensity = this.binary.read('uint8');
			data.nausea = this.binary.read('uint8');

			// unknown
			this.binary.skip(2);

			// track color scheme
			this.binary.skip(3 * 4);

			// unknown
			this.binary.skip(4);

			// dat file
			this.binary.skip(16);

			data.size = {
				x: this.binary.read('uint8'),
				y: this.binary.read('uint8')
			};

			// additional vehicle colors
			this.binary.skip(32);

			byte = this.binary.read('uint8');
			data.liftChainSpeed = (byte >> 3) * 1.6;
			data.numCircuits = byte >> 5;

			data.trackElements = [];

			while(this.binary.read('uint8') !== 0xff) {
				this.binary.seek(this.binary.tell() - 1);

				data.trackElements.push(this.binary.read('TrackElement'));
			}

			return data;
		}
	}),

	TrackElement: jBinary.Type({
		read: function() {
			var data = {};

			data.segment = this.binary.read('uint8');
			var qualifier = this.binary.read('uint8');
			data.qualifier = qualifier;

			data.chainLift = !!(qualifier & 0b10000000);
			data.invertedTrack = !!(qualifier & 0b01000000);
			data.trackColorScheme = (qualifier & 0b00110000) >> 3;

			// if segment is station
			if(data.segment === 1 || data.segment === 2 || data.segment === 3) {
				data.terminalStation = !!(qualifier & 0b00001000);
				data.station = qualifier & 0b00000011;
			}
			else {
				data.magnitude = (qualifier & 0b00001111) * 7.6;
			}

			return data;
		}
	}),
};

module.exports = config;