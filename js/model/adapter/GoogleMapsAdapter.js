define([
	'backbone',
	'model/ProfilePoints',
	],
	function(Backbone, ProfilePoints) {

		/**
		* 
		*/
		var GoogleMapsAdapter = Backbone.Model.extend({

			initialize: function(){
				console.log('new GoogleMapsAdapter created')
			},

			defaults: {
				service : new google.maps.ElevationService(),
				numberOfRows: 0,
				numberOfCols: 0
			},

			/**
			 * Höhendaten über Google Elevation API beziehen
			 */
			getProfileData: function(coordinates){
				var service = this.get('service');

				// Koordinaten-Array aufsplitten (max 512 coordinates pro request)
				var delay = 1000;

				var chunkSize = 150;
				var requestQueue = [];
				//var queue = new ProfilePoints(coordinates.models);
				for(var i=0; i<coordinates.length; i+=chunkSize){
					requestQueue.push(coordinates.slice(i, i+chunkSize));
				};
				
				this.trigger('adapter:start', coordinates.length, requestQueue.length, chunkSize, delay);
				
				var adapter = this;
				var index = 0;
				// Queue-Item abarbeiten
				var processNextQueueItem = function(){
					var request = {locations: requestQueue[index]};
					service.getElevationForLocations(request, onServiceResponse);
				};

				// Response handler
				var onServiceResponse = function(result, status){
					adapter.trigger('adapter:queue:progress', status, index+1, requestQueue.length);
					switch(status){
						case google.maps.ElevationStatus.OK:							

							$.each(result, function(i){
								adapter.trigger('adapter:item:progress');
								var searchResult = coordinates.findWhere({ 
														lat: Number(parseFloat(result[i].location.lat()).toFixed(4)), 
														lng: Number(parseFloat(result[i].location.lng()).toFixed(4))
													});
								if (searchResult)
									searchResult.set('elv', result[i].elevation);
							});

							if (++index < requestQueue.length){						
								processNextQueueItem();
							}
							else{
								adapter.trigger('adapter:end', coordinates);
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

		return GoogleMapsAdapter;

});
