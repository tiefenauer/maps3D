define([
	'jquery',
	'underscore',
	'backbone',
	'view/GoogleMapsView',
	'view/ProfileView',
	'model/ProfileModel',
	'text!templates/map_stats.html',
	'text!templates/profile_stats.html',
	'jqueryui'
	], 
	function($, _, Backbone, GoogleMapsView, ProfileView, ProfileModel, map_stats, profile_stats){

		Backbone.View.prototype.vent = _.extend({}, Backbone.Events);

		var AppView = Backbone.View.extend({

			el: '#maps3d',

			//-------------------------------------------------
			// Custom Attributes
			//-------------------------------------------------
			// Karte
			mapView : new GoogleMapsView({el: "#map-canvas"}),
			// Statistiken zur Karte
			mapStatsTemplate: _.template(map_stats),

			// Höhenprofil
			profileView : new ProfileView({el: "#profile-canvas"}),
			// Statistiken zum Höhenprofil
			profileStatsTemplate: _.template(profile_stats),

			//-------------------------------------------------
			// Event handler map
			//-------------------------------------------------
			events: {
				'click #submitButton': 'onSubmitButtonClick'
			},

			/**
			* Event listeners registrieren
			*/
			initialize: function(){
				console.log('new AppView created');

				this.$mapStats = this.$('#map-stats');
				this.listenTo(mapView, 'rect:changed', this.onRectChanged);
				this.mapView.render();
			},

			//-------------------------------------------------
			// Event handlers
			//-------------------------------------------------
			/**
			* Resolution has changed
			*/
			onRectChanged: function(bounds, horizontalResolution, verticalResolution)
			{
				this.$mapStats.html(this.mapStatsTemplate({
					horizontalSegments: horizontalResolution, 
					verticalSegments: verticalResolution, 
					numberOfPoints: horizontalResolution*verticalResolution, 
					numberOfRequests: 0, 
					sw: bounds.getSouthWest(), 
					ne: bounds.getNorthEast()
				}));
			},

			/**
			* Submit Button has been clicked
			*/
			onSubmitButtonClick: function(event)
			{
				$("#progressbar").progressbar({value: 37});

				console.log('submitButton clicked: sending Request');
				/*
				var profileModel = new ProfileModel({profilePoints: mapView.coordinates});
				this.profileView.listenTo(profileModel, 'processing:end', this.profileView.draw)
				profileModel.process();
				*/
			}


		});

		return AppView;
	
});