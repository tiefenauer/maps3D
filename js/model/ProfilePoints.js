ProfilePoints = Backbone.Collection.extend({
	model: ProfilePoint,

	initialize: function(){
		console.log('creating a new ProfilePoint Collection');
	}
});