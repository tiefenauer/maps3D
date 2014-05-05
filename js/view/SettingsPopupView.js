define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap_slider',
	'text!templates/settings_popup.html'
	],
	function($, _, Backbone, Slider, settings_popup){
		var SettingsPopupView = Backbone.View.extend({

			// Settings Popup
			template: _.template(settings_popup),

			events: {
				'click #saveButton': 'onSaveButtonClick',
				'click #cancelButton': 'onCancelButtonClick',
			},

			render: function(){
				this.el = null;
				this.setElement(this.template());				
				return this;
			},


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
			* User Clicked Save
			*/
			onSaveButtonClick: function(){
				var newValue = this.resolution;
			 	newValue = (newValue != undefined)?newValue:45;
				localStorage.setItem('resolution', newValue);
				this.$el.modal('hide');
			},

			onCancelButtonClick: function(){
				this.$el.modal('hide');
			}
		});

		return SettingsPopupView;
	})