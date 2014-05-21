/**
* info.tiefenauer.maps3d.model.ProfileModel
* A ProfileModel represents the data layer of an elevation profile. It is used
* to retrieve elevation data from any source over an adapter. 
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define([
	'backbone',
	'model/ProfilePoints',
	'model/adapter/GoogleMapsAdapter'
	], 
	function(Backbone, ProfilePoints, GoogleMapsAdapter){

		var ProfileModel = Backbone.Model.extend({

			/**
			* Initialize Model
			*/
			initialize: function(attributes, options){
				console.log("new ProfileModel created");

				var adapter = this.get('adapter');
				this.listenTo(adapter, 'adapter:start', this.onAdapterStart);
				this.listenTo(adapter, 'adapter:queue:progress', this.onAdapterQueueProgress);
				this.listenTo(adapter, 'adapter:end', this.onAdapterEnd);
			},

			/**
			* GoogleMapsAdapter is used as default adapter for elevation data. A new ProfilePoint-Objects is used as default.
			*/
			defaults: {
				profilePoints: new ProfilePoints(),
				adapter: new GoogleMapsAdapter()
			},

			/**
			* Get Elevation data for points
			* @param points the points for which the elevation data should be retrieved. If null, the default ProfilePoitns object is used
			* @param ad adapter over which the elevation data should be retrieved. If null, the default adapter is used.
			*/
			process: function(points, ad){
				var profilePoints = points || this.get('profilePoints');
				var adapter = ad || this.get('adapter');
				if (ad){
					this.stopListening(adapter);
					this.listenTo(ad, 'adapter:start', this.onAdapterStart);
					this.listenTo(ad, 'adapter:queue:progress', this.onAdapterQueueProgress);
					this.listenTo(ad, 'adapter:end', this.onAdapterEnd);
				}

				adapter.getProfileData(profilePoints);
			},

			/**
			* Cancel retrieving elevation data
			*/
			cancel: function(){
				console.log('trying to cancel');
				var adapter = this.get('adapter');
				adapter.cancel();
			},

			/**
			* Event handler: Adapter has started retrieving elevation data
			*/
			onAdapterStart: function(numCoordinates, numRequests, chunkSize, delay)
			{
				console.log('processing started');
				console.log('=====================================');
				console.log('Requesting Elevation data from Google');
				console.log('=====================================');
				console.log('Number of Coordinates: ' + numCoordinates);
				console.log('Total Number of Requests: ' + numRequests );
				console.log('Chunk size is: ' + chunkSize);
				console.log('Delay is: ' +  delay);
				console.log('-------------------------------------');
				this.trigger('processing:start');
			},
			/**
			* Event handler: Adapter has dispatched progress information
			*/
			onAdapterQueueProgress: function(status, currentItem, totalItems)
			{
				console.log('progressing queue item: ' + currentItem + '/' + totalItems + ' ==> ' + status);
				this.trigger('processing:progress', {
					status: status, 
					currentItem: currentItem, 
					totalItems: totalItems
				});
			},
			/**
			* Event handler: Adapter has finished retrieving elevation data
			*/
			onAdapterEnd: function(result)
			{
				console.log('processing: end');
				this.stopListening(this.adapter);
				this.trigger('processing:end', result);
			}


		},
		{
			// event for changes in profilePoint information
			PROFILE_POINTS_CHANGED: 'profile:points:change',
		});

		return ProfileModel;
});
