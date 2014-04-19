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
		'bootstrap_slider': ['jquery', 'bootstrap'],
		'QUnit': {
			exports: 'QUnit',
			init: function(){
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		},
		'sinon': {
			exports: 'sinon'
		},
		'sinonQunit': {
			deps: ['QUnit', 'jquery', 'sinon'],
			exports: 'sinonQunit'
		}

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
		QUnit: 'vendor/qunit/qunit-1.14.0',
		sinon: 'vendor/sinon/sinon-1.9.1',
		sinonQunit: 'vendor/sinon/sinon-qunit-1.0.0',
		gmaps: 'gmaps'
	}
});

require(
	[ 'QUnit', 'tests/ProfilePointTest', 'tests/ProfileModelTest'], 
	function (QUnit, ProfilePointTest, ProfileModelTest) {
		ProfilePointTest.run();
		ProfileModelTest.run();
		QUnit.load();
		QUnit.start();
	}
);
