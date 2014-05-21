/**
* info.tiefenauer.maps3d.view.AppView
* Main class to bootstrap Maps3D. All other Model- and View-Classes are created here
* and their events are mapped with the corresponding handler.
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'view/GoogleMapsView',
	'view/ProfileView',
	'view/SettingsPopupView',
	'model/ProfileModel',
	'text!templates/map_stats.html',
	'text!templates/profile_stats.html',
	'text!templates/progress_popup.html',
	'text!templates/settings_popup.html',
	'text!templates/info_popup.html',
	'jqueryui'
	], 
	function($, _, Backbone, GoogleMapsView, ProfileView, SettingsPopupView, ProfileModel, map_stats, profile_stats, progress_popup, settings_popup, info_popup){

		Backbone.View.prototype.vent = _.extend({}, Backbone.Events);

		var AppView = Backbone.View.extend({

			el: 'body',

			// map statistics
			mapStatsTemplate: _.template(map_stats),
			// elevation profile statistics
			profileStatsTemplate: _.template(profile_stats),			
			// progress popup
			progressPopupTemplate: _.template(progress_popup),
			// settings Popup
			settingsPopupTemplate: _.template(settings_popup),
			// info Popup
			infoPopupTemplate: _.template(info_popup),			

			/**
			* Register event handlers
			*/
			events: {
				'click #submitButton': 'onSubmitButtonClick',
				'click #settingsButton': 'onSettingsButtonClick',
				'click #infoButton': 'onInfoButtonClick'
			},

			/**
			* Bootstrap Maps3D
			*/
			initialize: function(){
				console.log('new AppView created');
				var mapCanvas = $('<div></div>').attr({id: "map-canvas"});
				var mapCanvasSearch = $('<input>').attr({id: "pac-input", class: "controls", type: "text", placeholder: "Ort für Maps3D suchen"});
				var profileCanvas = $('<div></div>').attr({id: "profile-canvas"});
				var searchButton = $('<button></button>').attr({id: "submitButton", type: "button", class: "btn btn-success"}).append($('<span></span>').attr({class: 'glyphicon glyphicon-chevron-right'}));
				var settingsButton = $('<button></button>').attr({id: "settingsButton", type: "button", class: "btn btn-default"}).append($('<span></span>').attr({class: 'glyphicon glyphicon-cog'}));
				var infoButton = $('<button></button>').attr({id: "infoButton", type: "button", class: "btn btn-default"}).append($('<span></span>').attr({class: 'glyphicon glyphicon-info-sign'}));

				this.$el.append(mapCanvas);
				this.$el.append(mapCanvasSearch);
				this.$el.append(searchButton);
				this.$el.append(profileCanvas);
				this.$el.append(settingsButton);
				this.$el.append(infoButton);

				this.mapView = new GoogleMapsView({el: mapCanvas});
				this.profileView = new ProfileView({el: profileCanvas});
				this.settingsPopupView = new SettingsPopupView();

				this.$mapStats = $(this.mapStatsTemplate({verticalSegments: 0, horizontalSegments: 0, numberOfPoints: 0, numberOfRequests: 0, sw: 0, ne: 0}));
				this.$progressPopup = $(this.progressPopupTemplate({progress: 0}));
				this.$settingsPopup = $(this.settingsPopupTemplate());
				this.$infoPopup = $(this.infoPopupTemplate());
				this.listenTo(mapView, 'rect:changed', this.onRectChanged);
				this.mapView.render();
			},

			//-------------------------------------------------
			// Event handlers
			//-------------------------------------------------
			/**
			* Selection rectangle bouns have changed
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
				var self=this;
				this.$progressPopup.modal('show');

				var profileModel = new ProfileModel({profilePoints: mapView.coordinates});
				this.$progressPopup.on('hide.bs.modal', $.proxy(profileModel.cancel, profileModel));
				this.listenTo(profileModel, 'processing:start', this.onProgressStart);
				this.listenTo(profileModel, 'processing:progress', this.onProgressUpdate);
				this.listenTo(profileModel, 'processing:end', this.onProgressEnd);
				this.profileView.listenTo(profileModel, 'processing:end', this.profileView.draw);

				profileModel.process();								
			},

			/**
			* Settings Button has been clicked
			*/
			onSettingsButtonClick: function(event)
			{
				this.settingsPopupView.show();
			},
			/**
			* Settings Button has been clicked
			*/
			onInfoButtonClick: function(event)
			{
				this.$infoPopup.modal('show');
			},
			/**
			* Progress event received from profile model
			*/
			onProgressStart: function()
			{
				$("#progressbar .progress-bar").css('width', '0%');
			},
			/**
			* Progress event received from profile model
			*/
			onProgressUpdate: function(progressInfo)
			{
				var current = progressInfo['currentItem'];
				var total = progressInfo['totalItems'];
				var progress = Math.floor(current/total * 100);
				$("#progressbar .progress-bar").css('width', progress + '%');
			},
			/**
			* Processing finished event received from profile model
			*/
			onProgressEnd: function(progressInfo)
			{
				this.$progressPopup.modal('hide');
			}


		});

		return AppView;
	
});