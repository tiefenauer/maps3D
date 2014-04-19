module("ProfilePointTest");
	test( "can be instantiated", function() {
		expect(3)
	  	var point = new ProfilePoint();
	  	equal(0, point.lat);
	  	equal(0, point.lng);
	  	equal(0, point.elv);
	});