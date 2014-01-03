/**
 * Constructor 
 */
function GoogleMapsAdapter()
{
	this.service = 	new google.maps.ElevationService();
	this.numberOfRows = 0;;
	this.numberOfCols = 0;
};

/**
 * Höhendaten über Google Elevation API beziehen
 */
GoogleMapsAdapter.prototype.getProfileData = function(coordinates, callback)
{
	// callback und Resultat-Array speichern
	this.callback = callback;
	this.elevationPoints = [];
	
	// Koordinaten-Array aufsplitten (max 512 coordinates pro request)
	var tempArray, requestCoordinates = [], chunk=150;
	delay = 1000;
	for(var i=0; i<coordinates.length; i+=chunk){
		tempArray = coordinates.slice(i, i+chunk);
		requestCoordinates.push(tempArray);
	};
	
	this.requestCoordinates = requestCoordinates;
	this.numberOfRequests = requestCoordinates.length;
	currentArrayIndex=0;
	
	log('=====================================');
	log('Requesting Elevation data from Google');
	log('=====================================');
	log('Chunk size is: ' + chunk);
	log('Number of Coordinates: ' + coordinates.length);
	log('Total Number of Requests: ' + requestCoordinates.length );
	log('Delay is: ' +  delay);
	log('-------------------------------------');
	
	self = this;
	for (var i=0; i<requestCoordinates.length; i++){
		setTimeout(function(){
			log('Request ' + currentArrayIndex + '/' + self.requestCoordinates.length);
			var tempArray = self.requestCoordinates[currentArrayIndex];
			var points = [];
			tempArray.forEach(function(coordinate){
				points.push([coordinate.lat(), coordinate.lng()]);
			});
			var encoded = self.createEncodings(points);
			var requestUrl = 'http://maps.googleapis.com/maps/api/elevation/json?locations=enc:' + encoded + '&sensor=true';
			
			//$.get(requestUrl, onServiceSuccess);
			
			var request = { 'locations': tempArray};

			self.service.getElevationForLocations(request, self.onServiceCompleted);
			currentArrayIndex++;			
		}, i*1000);
		
	};
};

function onServiceSuccess(data){
	var result = JSON.parse(data);
	
};

/**
 * 
 */
GoogleMapsAdapter.prototype.createEncodings = function (coords) {
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
};
 
GoogleMapsAdapter.prototype.encodePoint = function(plat, plng, lat, lng) {
	var late5 = Math.round(lat * 1e5);
    var plate5 = Math.round(plat * 1e5);    
 
	var lnge5 = Math.round(lng * 1e5);
    var plnge5 = Math.round(plng * 1e5);
 
	dlng = lnge5 - plnge5;
	dlat = late5 - plate5;
 
    return self.encodeSignedNumber(dlat) + self.encodeSignedNumber(dlng);
};
 
GoogleMapsAdapter.prototype.encodeSignedNumber = function(num) {
  var sgn_num = num << 1;
 
  if (num < 0) {
    sgn_num = ~(sgn_num);
  }
 
  return(self.encodeNumber(sgn_num));
};
 
GoogleMapsAdapter.prototype.encodeNumber = function(num) {
  var encodeString = "";
 
  while (num >= 0x20) {
    encodeString += (String.fromCharCode((0x20 | (num & 0x1f)) + 63));
    num >>= 5;
  }
 
  encodeString += (String.fromCharCode(num + 63));
  return encodeString;
};


/**********************************************************
 * EVENT HANDLERS
 *********************************************************/
/**
 * Service response handler 
 */
GoogleMapsAdapter.prototype.onServiceCompleted = function(result, status){
	log('Elevation service request: ' + status);
	log('Number of elevations : ' + result.length);

	$.each(result, function(i){
		var googleResult = result[i];
		var profilePoint = new MapProfilePoint(googleResult.location.lat(), googleResult.location.lng(), googleResult.elevation);
		self.elevationPoints.push(profilePoint);
	});
	
	self.numberOfRequests--;
	if (self.numberOfRequests == 0){
		log('=====================================');
		log('Finished');
		log('=====================================');
		self.callback.call(self, self.elevationPoints);
	}
};