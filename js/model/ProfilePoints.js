define(['backbone', 'model/ProfilePoint'], function(Backbone, ProfilePoint){

	var ProfilePoints = Backbone.Collection.extend({

		model: ProfilePoint,

		initialize: function(){
			console.log('creating a new ProfilePoints Collection');
		}
	});

	return ProfilePoints;
});