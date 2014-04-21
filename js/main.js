require.config({
	shim: {
		'jqueryui': {
			deps: ['jquery']
		},
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
		'vendor/three/controls/TrackballControls': {
			deps: ['THREE']
		},
		'vendor/three/controls/OrbitControls': {
			deps: ['THREE']
		},
		'bootstrap_slider': ['jquery', 'bootstrap']

	},

	paths: {
		jquery: 'vendor/jquery/jquery-2.0.3.min',
		jqueryui: 'vendor/jquery/jquery-ui.min',
		underscore: 'vendor/underscore/underscore-min',
		backbone: 'vendor/backbone/backbone.min',
		text: 'vendor/require/text',
		async: 'vendor/require/async',		
		bootstrap: 'vendor/bootstrap/bootstrap.min',
		bootstrap_slider: 'vendor/bootstrap/bootstrap-slider',
		THREE: 'vendor/three/three.min',
		gmaps: 'gmaps'		
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
