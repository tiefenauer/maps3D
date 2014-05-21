/**
* info.tiefenauer.maps3d.view.SettingsPopupView
* View class for the settings popup.
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap_slider',
	'text!templates/settings_popup.html'
	],
	function($, _, Backbone, Slider, settings_popup){
		var SettingsPopupView = Backbone.View.extend({

			// Template 
			template: _.template(settings_popup),

			/**
			* Register event handlers
			*/
			events: {
				'click #saveButton': 'onSaveButtonClick',
				'click #cancelButton': 'onCancelButtonClick',
			},

			/**
			* Render the Popup
			*/
			render: function(){
				this.el = null;
				this.setElement(this.template());				
				return this;
			},

			/**
			* Show the modal popup
			*/
			show: function(){
				this.render();
				var self=this;
				var userValue = localStorage.getItem('resolution');
				userValue = (userValue && userValue.length > 0)?parseInt(userValue):45;

				
				this.$el.on('shown.bs.modal', function(e){
					self.$('#slider').slider({
						min: 0,
						max: 100,
						step: 1,
						orientation: 'horizontal',
						selection: 'after',
						value: userValue
					});	
					self.$('#slider').on('slideStop', function(stopEvent){
						var value = self.$('#slider').slider('getValue').val();
						self.resolution = value;
					});
				
				})
				
				this.$el.modal('show');
				
			},

			/**
			* Event handler: User clicked save button
			*/
			onSaveButtonClick: function(){
				var newValue = this.resolution;
			 	newValue = (newValue != undefined)?newValue:45;
				localStorage.setItem('resolution', newValue);
				this.$el.modal('hide');
			},
			/**
			* Event handler: user clicked cancel button
			*/
			onCancelButtonClick: function(){
				this.$el.modal('hide');
			}
		});

		return SettingsPopupView;
	})