ProfileProperties = Backbone.Model.extend({
	
	initialize: function(){
		console.log('new ProfileProperties created');
	},

	defaults: {
		profilePoints: new ProfilePoints();
	}

	minLng: function(){
		return _.min(this.get('profilePoints').pluck('lng'));
	},

	maxLng: function(){
		return _.min(this.get('profilePoints').pluck('lng'));
	},

	minLat: function(){
		return _.min(this.get('profilePoints').pluck('lat'));
	},

	maxLat: function(){
		return _.min(this.get('profilePoints').pluck('lat'));
	},

	segments: function(){
		return Math.sqrt(this.get('elevationPoints').length));
	}

});