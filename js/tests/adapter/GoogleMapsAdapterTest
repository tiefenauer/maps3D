define(
	['sinon', 'model/ProfileModel', 'model/ProfilePoints', 'model/adapter/GoogleMapsAdapter', 'backbone'],
	function(sinon, ProfileModel, ProfilePoints, GoogleMapsAdapter, Backbone){
		var run = function(){
			var model;
			module("ProfileModel",{
				setup: function(){
					model = new ProfileModel();
				},
				teardown: function(){
					//model = null;
				}
			});
			test('can be instantiated', function(){
				expect(4);
				model = new ProfileModel();
				// defaults should not be null
				notEqual(model.get('profilePoints'), null, "profilePoints-Attribute should be initialized with default value");
				notEqual(model.get('adapter'), null, "adapter-Attribute should be initialized with default adapter")
				// assert types of defaults
				ok(model.get('profilePoints') instanceof ProfilePoints);
				ok(model.get('adapter') instanceof GoogleMapsAdapter);
			});

			test('event handlers should exist and have a correct signature', function(){
				expect(6);

				// checking function existence
				strictEqual($.type(model.onAdapterStart), 'function');
				strictEqual($.type(model.onAdapterQueueProgress), 'function');
				strictEqual($.type(model.onAdapterEnd), 'function');
				// checking number of arguments
				equal(model.onAdapterStart.length, 4);
				equal(model.onAdapterQueueProgress.length, 3);
				equal(model.onAdapterEnd.length, 1);
			});

			test('process() without arguments should use defaults', function(){
				expect(1);
				var defaultPoints = model.get('profilePoints');
				model.set('adapter', {'getProfileData': sinon.spy() });
				model.process();
				ok(model.get('adapter').getProfileData.calledOnce);
			});

			test('process() without adapter should use default adapter', function(){
				expect(2);
				var customPoints = new ProfilePoints();
				model.set('adapter', {'getProfileData': sinon.spy() });
				model.process();
				ok(model.get('adapter').getProfileData.calledOnce);		
				ok(model.get('adapter').getProfileData.calledWith(customPoints))		;
			});

			test('events triggered by the adapter should be listened to', function(){
				// mock adapter
				model.get('adapter').getProfileData = function(arg){
					model.get('adapter').trigger('adapter:start', 10, 2, 5, 100);
					for(var i=0; i<3; i++){
						model.get('adapter').trigger('adapter:queue:progress', 'OK', i, 3);
					};
					model.get('adapter').trigger('adapter:end', 10, 2, 5, 100);
				};
				
				// spy on event handlers
				var init = ProfileModel.prototype.initialize;
				ProfileModel.prototype.initialize = function(){
					sinon.spy(this, 'onAdapterStart');
					sinon.spy(this, 'onAdapterQueueProgress');
					sinon.spy(this, 'onAdapterEnd');
					init.apply(this, arguments);
				}
				model = new ProfileModel();		
				model.process();

				ok(model.onAdapterStart.calledOnce);
				ok(model.onAdapterQueueProgress.calledThrice);
				ok(model.onAdapterEnd.calledOnce);

				ProfileModel.prototype.initialize = init;

			});


			test('model should trigger events when getting updates from adapter', function(){
				// mock adapter
				model.get('adapter').getProfileData = function(arg){
					model.get('adapter').trigger('adapter:start', 10, 2, 5, 100);
					for(var i=0; i<3; i++){
						model.get('adapter').trigger('adapter:queue:progress', 'OK', i, 3);
					};
					model.get('adapter').trigger('adapter:end', 10, 2, 5, 100);
				};

				// listen to events
				var vent = _.extend({}, Backbone.Events);
				var processingStart = sinon.spy();
				var processingProgress = sinon.spy();
				var processingEnd = sinon.spy();
				vent.listenTo(model, 'processing:start', processingStart);
				vent.listenTo(model, 'processing:progress', processingProgress);
				vent.listenTo(model, 'processing:end', processingEnd);
				model.process();

				ok(processingStart.calledOnce);
				ok(processingProgress.calledThrice);
				ok(processingEnd.calledOnce);
			});

/*
			test('setting the adapter should not remove the event listeners', function(){
				expect(0);
				// mock adapter
				var adapterMock = sinon.stub(model.get('adapter'));				

			});
*/
		};
		return  {run: run};
	}
);