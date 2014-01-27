define(['backbone'], function(Backbone){

	var ProfilePoint = Backbone.Model.extend({
		initialize: function(){
			console.log('new ProfilePoint created');
			this.__defineGetter__('lat', function(){ return this.get('lat')});
			this.__defineGetter__('lng', function(){ return this.get('lng')});
		},

		defaults: {
			lat: 0.000,
			lng: 0.000,
			elv: 0.000
		},


	});

	return ProfilePoint;
	
});
