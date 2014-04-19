define(['backbone'], function(Backbone){

	var ProfilePoint = Backbone.Model.extend({
		initialize: function(){
			console.log('new ProfilePoint created');
			this.__defineGetter__('lat', function(){ return this.get('lat')});
			this.__defineGetter__('lng', function(){ return this.get('lng')});
			this.__defineGetter__('elv', function(){ return this.get('elv')});

			this.__defineSetter__('lat', function(value){ this.set('lat', value)});
			this.__defineSetter__('lng', function(value){ this.set('lng', value)});
			this.__defineSetter__('elv', function(value){ this.set('elv', value)});
		},

		defaults: {
			lat: 0.000,
			lng: 0.000,
			elv: 0.000
		},


	});

	return ProfilePoint;
	
});
