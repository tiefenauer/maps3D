/**
* info.tiefenauer.maps3d.model.ProfileModel
* Aggregator class to maintain a set of ProfilePoint objects. No further functionality than
* the one inherited from Backbone.Collection.
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define(['backbone', 'model/ProfilePoint'], function(Backbone, ProfilePoint){

	var ProfilePoints = Backbone.Collection.extend({

		model: ProfilePoint,

		/**
		* Initialize Model
		*/
		initialize: function(){
			console.log('creating a new ProfilePoints Collection');
		}
	});

	return ProfilePoints;
});