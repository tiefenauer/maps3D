define([
	'backbone',
	'model/ProfilePoints',
	'model/adapter/GoogleMapsAdapter'
	], 
	function(Backbone, ProfilePoints, GoogleMapsAdapter){

		var ProfileModel = Backbone.Model.extend({

			initialize: function(attributes, options){
				console.log("new ProfileModel created");

				var adapter = this.get('adapter');
				this.listenTo(adapter, 'adapter:start', this.onAdapterStart);
				this.listenTo(adapter, 'adapter:queue:progress', this.onAdapterQueueProgress);
				this.listenTo(adapter, 'adapter:end', this.onAdapterEnd);
			},

			defaults: {
				profilePoints: new ProfilePoints(),
				adapter: new GoogleMapsAdapter()
			},

			process: function(points, ad){
				var profilePoints = points || this.get('profilePoints');
				var adapter = ad || this.get('adapter');
				adapter.getProfileData(profilePoints);
			},

			/**
			* Event handlers
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
			},
			onAdapterQueueProgress: function(status, currentItem, totalItems)
			{
				console.log('progressing queue item: ' + currentItem + '/' + totalItems + ' ==> ' + status);
			},
			onAdapterEnd: function(result)
			{
				console.log('processing: end');
				this.stopListening(this.adapter);
				this.trigger('processing:end', result);
			}

		},
		{
			// event types
			PROFILE_POINTS_CHANGED: 'profile:points:change',
		});

		return ProfileModel;
});
