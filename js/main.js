require.config({
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'THREE': {
			exports: 'THREE'
		},
		'libs/three/controls/TrackballControls': {
			deps: ['THREE']
		},
		'libs/three/controls/OrbitControls': {
			deps: ['THREE']
		},
		'bootstrap_slider': ['jquery', 'bootstrap']

	},

	paths: {
		jquery: 'libs/jquery/jquery-2.0.3.min',
		underscore: 'libs/underscore/underscore-min',
		backbone: 'libs/backbone/backbone.min',
		text: 'libs/require/text',
		bootstrap: 'libs/bootstrap/bootstrap.min',
		bootstrap_slider: 'libs/bootstrap/bootstrap-slider',
		THREE: 'libs/three/three.min'
	}
});

require([ 'view/AppView'], function (AppView) {
        new AppView();     

        /*
		$(document).ready(function(){
			var onSliderValueChanged = function(event){
				var gridSize = $('#slider').slider('getValue').val();
				mapView.setGridSize(gridSize);
			};

			var onSubmitButtonClick = function(event){
				var gridSize = $('#slider').slider('getValue').val();					
				mapView.setGridSize(gridSize);
				var coordinates = mapView.getCoordinates();
				profileModel.process(coordinates);					
			};

			var onProfilePointsChanged = function(newProfilePoints){
				console.log('received new profile points!');
				profileView.draw(newProfilePoints);
			};

			/*
			var profileModel = new ProfileModel();	
			console.log(ProfileModel.PROFILE_POINTS_CHANGED)		;
			profileModel.on(ProfileModel.PROFILE_POINTS_CHANGED, onProfilePointsChanged);


			$("#slider").slider().on('slideStop', onSliderValueChanged);
			$("#submitBtn").click(onSubmitButtonClick);

		});
		*/
});
