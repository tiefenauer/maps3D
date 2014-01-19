ProfilePoint = Backbone.Model.extend({
	initialize: function(){
		console.log('new ProfilePoint created');
	},

	defaults: {
		lat: 0.000,
		lng: 0.000,
		elv: 0.000
	}
});