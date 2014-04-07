define(['backbone'], function(Backbone){

	GoogleMapsUtil = Backbone.Model.extend({
	},
	{
		createEncodings: function (coords) {
			var i = 0;
		 
			var plat = 0;
			var plng = 0;
		 
			var encoded_points = "";
		 
			for(i = 0; i < coords.length; ++i) {
			    var lat = coords[i][0];				
				var lng = coords[i][1];		
		 
				encoded_points += self.encodePoint(plat, plng, lat, lng);
		 
			    plat = lat;
			    plng = lng;
			}
		 
			// close polyline
			//encoded_points += self.encodePoint(plat, plng, coords[0][0], coords[0][1]);
		 
			return encoded_points;
		},
	 
		encodePoint: function(plat, plng, lat, lng) {
			var late5 = Math.round(lat * 1e5);
		    var plate5 = Math.round(plat * 1e5);    
		 
			var lnge5 = Math.round(lng * 1e5);
		    var plnge5 = Math.round(plng * 1e5);
		 
			dlng = lnge5 - plnge5;
			dlat = late5 - plate5;
		 
		    return self.encodeSignedNumber(dlat) + self.encodeSignedNumber(dlng);
		},
	 
		encodeSignedNumber: function(num) {
		  var sgn_num = num << 1;
		 
		  if (num < 0) {
		    sgn_num = ~(sgn_num);
		  }
		 
		  return(self.encodeNumber(sgn_num));
		},
		 
		encodeNumber: function(num) {
		  var encodeString = "";
		 
		  while (num >= 0x20) {
		    encodeString += (String.fromCharCode((0x20 | (num & 0x1f)) + 63));
		    num >>= 5;
		  }
		 
		  encodeString += (String.fromCharCode(num + 63));
		  return encodeString;
		},

		degreeToMeter: function(p1, p2)
		{
			Number.prototype.toRad = function () { return this * Math.PI / 180; }
			var R = 6371; // Earth radius in km
			var dLat = Number(Math.max(p1.lat, p2.lat)-Math.min(p1.lat, p2.lat)).toRad();
			var dLng = Number(Math.max(p1.lng, p2.lng)-Math.min(p1.lng, p2.lng)).toRad();
			var lat1 = Number(p1.lat).toRad();
			var lat2 = Number(p2.lat).toRad();

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			return d*1000;
		},

		toDegree: function(angle)
		{
			return angle * (180/Math.PI);
		},

		toRad: function(angle)
		{
			return angle * (Math.PI/180);
		}		
	});

	return GoogleMapsUtil;
});
