define(
	['sinon', 
	 'model/adapter/GoogleMapsAdapter',
	 'model/ProfilePoints'
	 ],
	function(sinon, GoogleMapsAdapter, ProfilePoints){
		var run = function(){
			var adapter;
			var originalService;
			module("GoogleMapsAdapter",{
				setup: function(){
					adapter = new GoogleMapsAdapter();
					originalService = adapter.get('service');									
				},
				teardown: function(){
					
				}
			});
			test('can be instantiated', function(){
				expect(4);				
				// defaults should not be null
				equal(adapter.get('numberOfRows'), 0, "numberOfRows-Attribute should be initialized with default value");
				equal(adapter.get('numberOfCols'), 0, "numberOfCols-Attribute should be initialized with default value");
				notEqual(adapter.get('service'), null, "Adapter should be initialized with service");
				// assert types of defaults
				ok(adapter.get('service') instanceof google.maps.ElevationService);
			});

			test('getProfileData() should trigger the events on success', function(){
				var coordinates = new ProfilePoints();
				coordinates.add({lat: 0, lng: 0});
				coordinates.add({lat: 1, lng: 1});

				var result = [
					{
						location: { lat: function(){return 0}, lng: function(){return 0}},
						elevation: 0
					},
					{
						location: { lat: function(){return 1}, lng: function(){return 1}},
						elevation: 1
					},
				];
				var serviceMock = { getElevationForLocations: function(request, responseCallback){
					responseCallback.call(this, result, google.maps.ElevationStatus.OK);
				}};				

				var startSpy = sinon.spy();
				var progressSpy = sinon.spy();
				var endSpy = sinon.spy();
				Backbone.Events.listenTo(adapter, 'adapter:start', startSpy);
				Backbone.Events.listenTo(adapter, 'adapter:queue:progress', progressSpy);
				Backbone.Events.listenTo(adapter, 'adapter:end', endSpy);
				adapter.set('service', serviceMock);
				adapter.getProfileData(coordinates);
				adapter.set('service', originalService);

				ok(startSpy.calledOnce);
				ok(progressSpy.calledOnce);
				ok(endSpy.calledOnce);
				Backbone.Events.stopListening(adapter);
			});
		};

		return  {run: run};
	}
);