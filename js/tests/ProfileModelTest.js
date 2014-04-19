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

			test('events triggered by the adapter should be listened upon', function(){
				var vent = _.extend({}, Backbone.Events);

				// mock adapter
				var adapterMock = model.get('adapter');
				adapterMock.getProfileData = function(arg){
					model.get('adapter').trigger('adapter:start', 10, 2, 5, 100);
					for(var i=0; i<3; i++){
						model.get('adapter').trigger('adapter:queue:progress', 'OK', i, 3);
					};
					model.get('adapter').trigger('adapter:end', 10, 2, 5, 100);
				};
				
				// listen to events
				var processingStart = sinon.spy();
				var processingProgress = sinon.spy();
				var processingEnd = sinon.spy();
				vent.listenTo(model, 'processing:start', processingStart);
				vent.listenTo(model, 'processing:progress', processingProgress);
				vent.listenTo(model, 'processing:end', processingEnd);

				model = new ProfileModel();
				model.set('adapter', adapterMock);
				// spy on event handlers
				var startSpy = sinon.spy(model, 'onAdapterStart');				
				var progressSpy = sinon.spy(model, 'onAdapterQueueProgress');
				var endSpy = sinon.spy(model, 'onAdapterEnd');
		
				model.process(model.get('profilePoints'), adapterMock);

				ok(model.onAdapterStart.calledOnce);
				ok(model.onAdapterQueueProgress.calledThrice);
				ok(model.onAdapterEnd.calledOnce);
				ok(startSpy.calledOnce);
				ok(progressSpy.calledThrice);
				ok(endSpy.calledOnce);
				ok(processingStart.calledOnce);
				ok(processingProgress.calledThrice);
				ok(processingEnd.calledOnce);
				/*
				model.onAdapterStart.restore();
				model.onAdapterQueueProgress.restore();
				model.onAdapterEnd.restore();
				*/
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