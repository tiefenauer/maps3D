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
});
