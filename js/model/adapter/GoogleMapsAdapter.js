/**
* 
*/
var GoogleMapsAdapter = Backbone.Model.extend({
	initialize: function(){
		console.log('new GoogleMapsAdapter created')
	},

	defaults: {
		service : new google.maps.ElevationService(),
		profileData: new ProfilePoints(),
		numberOfRows: 0,
		numberOfCols: 0
	},

	/**
	 * Höhendaten über Google Elevation API beziehen
	 */
	getProfileData: function(coordinates, callback){
		var service = this.get('service');
		var elevationPoints = [];

		// Koordinaten-Array aufsplitten (max 512 coordinates pro request)
		var tempArray, requestQueue = [], chunk=150, delay = 1000;

		for(var i=0; i<coordinates.length; i+=chunk){
			tempArray = coordinates.slice(i, i+chunk);
			requestQueue.push(tempArray);
		};
		
		log('=====================================');
		log('Requesting Elevation data from Google');
		log('=====================================');
		log('Chunk size is: ' + chunk);
		log('Number of Coordinates: ' + coordinates.length);
		log('Total Number of Requests: ' + requestQueue.length );
		log('Delay is: ' +  delay);
		log('-------------------------------------');
		
		var index = 0;
		// Queue-Item abarbeiten
		var processNextQueueItem = function(){
			var queueItem = requestQueue[index];
			log('Request ' + index + '/' + requestQueue.length);
			var request = {locations: queueItem};
			service.getElevationForLocations(request, onServiceResponse);
		};

		// Response handler
		var onServiceResponse = function(result, status){
			log('Elevation service request: ' + status);
			switch(status){
				case google.maps.ElevationStatus.OK:
					log('Number of elevations : ' + result.length);

					$.each(result, function(i){
						var googleResult = result[i];
						var profilePoint = new ProfilePoint({
							lat: googleResult.location.lat(), 
							lng: googleResult.location.lng(), 
							elv: googleResult.elevation
						});
						elevationPoints.push(profilePoint);
					});

					if (++index < requestQueue.length){						
						processNextQueueItem();
					}
					else{
						log('=====================================');
						log('Finished');
						log('=====================================');
						callback.call(this, elevationPoints);
					}
				break;

				default:
					setTimeout(processNextQueueItem, 1000);
				break;
			}
			
		};

		processNextQueueItem();
	}


});
