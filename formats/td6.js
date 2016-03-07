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

			data._unknown_01 = this.binary.read('uint8');

			data.specialTrackFlags = this.binary.read('uint32');
			data.operatingMode = this.binary.read('uint8');

			data.vehicleColorScheme = this.binary.read('uint8');
			data.vehicleColors = this.binary.read(['array', 'uint16', 32]);

			data._unknown_48 = this.binary.read('uint8');

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

			data._unknown_5E = this.binary.read('uint8');
			data._unknown_5F = this.binary.read('uint8');

			data.trackColors = this.binary.read(['array', 'uint32', 3]);

			data._unknown_6C = this.binary.read('uint8');
			data._unknown_6D = this.binary.read('uint8');
			data._unknown_6E = this.binary.read('uint8');
			data._unknown_6F = this.binary.read('uint8');

			data.DATfile = this.binary.read(['array', 'uint8', 16]);

			data.size = {
				x: this.binary.read('uint8'),
				y: this.binary.read('uint8')
			};

			// additional vehicle colors
			data.vehicleAdditionalColors = this.binary.read(['array', 'uint8', 32]);

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

			data.address = this.binary.tell();

			data.segment = this.binary.read('uint8').toString(16);
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