ProfileModel = Backbone.Model.extend({

	initialize: function(){
		console.log("new ProfileModel created");
		this.get('profilePoints').on('change reset', this.onProfilePointsChanged, this);
	},

	defaults: {
		profilePoints: new ProfilePoints(),
		adapter: new GoogleMapsAdapter()
	},

	onProfilePointsChanged: function(){
		console.log('Profile Points changed');
		var pointsArr = [];
		this.trigger(ProfileModel.PROFILE_POINTS_CHANGED, this.get('profilePoints'));
	},

	process: function(coordinates2D){
		var adapter = this.get('adapter');
		var profilePoints = this.get('profilePoints');
		var onAdapterDataReceived = function(coordinates3D){
			console.log(coordinates3D.length + ' profile points received');
			profilePoints.reset(coordinates3D);
		};
		adapter.getProfileData(coordinates2D, onAdapterDataReceived);
	}
},
{
	// event types
	PROFILE_POINTS_CHANGED: 'profilePointsChanged',
}
);