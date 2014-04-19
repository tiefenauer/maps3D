define(
	['model/ProfilePoint'],
	function(ProfilePoint){
		var run = function(){
			module("ProfilePoint");
			test('can be instantiated', function(){
				expect(3);

				var point = new ProfilePoint();
				equal(point.lat, 0);
				equal(point.lng, 0);
				equal(point.elv, 0);
			});
			test('Test getters', function(){
				expect(3);

				var point = new ProfilePoint({lat: 1, lng: 2, elv:3});

				equal(point.get('lat'), 1);
				equal(point.get('lng'), 2);
				equal(point.get('elv'), 3);
			});
			test('Test setters', function(){
				expect(3);

				var point = new ProfilePoint();
				point.lat = 1;
				point.lng = 2;
				point.elv = 3;

				equal(point.get('lat'), 1);
				equal(point.get('lng'), 2);
				equal(point.get('elv'), 3);
			});
		};
		return  {run: run};
	}
);