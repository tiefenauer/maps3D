/**
* info.tiefenauer.maps3d.model.adapter.GoogleMapsAdapter
* Adapter to retrieve elevation data over the GoogleMaps API.
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define([
	'backbone',
	'model/ProfilePoints',
	'gmaps'
	],
	function(Backbone, ProfilePoints, gmaps) {

		var GoogleMapsAdapter = Backbone.Model.extend({

			/**
			* Initialize GoogleMapsAdapter
			*/
			initialize: function(){
				console.log('new GoogleMapsAdapter created')
			},

			/**
			* Create new google.maps.ElevationService instance as default service for this adapter
			*/
			defaults: {
				service : new google.maps.ElevationService(),
				numberOfRows: 0,
				numberOfCols: 0,
				stop: false
			},

			/**
			 * Retrieve elevation data over GoogleMaps API
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
					var stop = adapter.get('stop');
					if (!stop ){
						var request = {locations: requestQueue[index]};
						service.getElevationForLocations(request, onServiceResponse);						
					}
					else{
						adapter.set('stop', false);
					}
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
			},

			/**
			* Cancel retrieving elevation data over GoogleMaps API
			*/
			cancel: function(){
				this.set('stop', true);
			}

		});

		return GoogleMapsAdapter;

});
