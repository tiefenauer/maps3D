/**
* info.tiefenauer.maps3d.model.ProfilePoint
* A ProfilePoint represents a combination of coordinates and elevation information.
* It can be used as a base to calculate vertices for the elevation Profile
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define(['backbone'], function(Backbone){

	var ProfilePoint = Backbone.Model.extend({

		/**
		* Initialize ProfilePoint
		* Define getters and setters
		*/
		initialize: function(){
			console.log('new ProfilePoint created');
			this.__defineGetter__('lat', function(){ return this.get('lat')});
			this.__defineGetter__('lng', function(){ return this.get('lng')});
			this.__defineGetter__('elv', function(){ return this.get('elv')});

			this.__defineSetter__('lat', function(value){ this.set('lat', value)});
			this.__defineSetter__('lng', function(value){ this.set('lng', value)});
			this.__defineSetter__('elv', function(value){ this.set('elv', value)});
		},

		/**
		* The default coordinates of a ProfilePoint are 0/0 with elevation 0
		*/
		defaults: {
			lat: 0.000,
			lng: 0.000,
			elv: 0.000
		},


	});

	return ProfilePoint;
	
});
