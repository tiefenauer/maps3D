GoogleMapsView = Backbone.View.extend({

	map: null,
	rect: new google.maps.Rectangle({editable: true, draggable: true}),

	initialize: function(){
		console.log('new GoogleMapsView created');
		// map
		var mapOptions = {
			center : new google.maps.LatLng(45.976433, 7.658448), // Matterhorn
			zoom : 12,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(this.el, mapOptions);

		// Auswahlrechteck erstellen
		this.rect.setMap(this.map);
		this.rect.setBounds(new google.maps.LatLngBounds(		
			new google.maps.LatLng(45.956433, 7.63),
			new google.maps.LatLng(46, 7.7 )
		));

		this.render();
	},

	setGridSize: function(value){
		this.gridSize = value;
	},

	getCoordinates: function(){
		var gridSize = this.gridSize || 1;
		
		// Positionen der Ecken bestimmen
		var ne = this.rect.getBounds().getNorthEast();
		var sw = this.rect.getBounds().getSouthWest();
		var nw = new google.maps.LatLng(ne.lat(), sw.lng());
		var se = new google.maps.LatLng(sw.lat(), ne.lng());
		
		// get values on x-axis
		var xFrom = nw.lng();
		var xTo = ne.lng();	
		var xStep = (xTo-xFrom)/(gridSize-1);
		
		// get values on y-axis
		var yFrom = se.lat();
		var yTo = ne.lat();
		var yStep = (yTo-yFrom)/(gridSize-1);
		
		var i=0;
		var coordinates = [];
		for(var y=0; y<gridSize; y++){
			yVal = yTo - y*yStep;
			
			for (var x=0; x<gridSize; x++){
				xVal = xFrom + x*xStep;
				var latLng = new google.maps.LatLng(yVal, xVal);
				coordinates[i] = latLng;
				i++;
			}
		}
		return coordinates;
	}

});