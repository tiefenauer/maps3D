
/**
 *Constructor 
 */
function GoogleMapsMediator(canvas)
{
	self = this;
	this.map = this.createMap(canvas);
	this.rectMarker = this.createRectMarker();
	this.rect = this.createRectangle(this.rectMarker);
	this.circles = [];
	
	this.initialize();
}

/**
 * Initialisieren 
 */
GoogleMapsMediator.prototype.initialize = function()
{
	this.rect.setMap(this.map);
	this.addEventListeners();
};


/**
 * Event Listeners hinzufügen 
 */
GoogleMapsMediator.prototype.addEventListeners = function()
{
	// Rectangle
	google.maps.event.addListener(this.rect, 'bounds_changed', this.onRectBoundsChanged);
	google.maps.event.addListener(this.rect, 'mousedown', this.onRectMouseDown);
	google.maps.event.addListener(this.rect, 'mouseup', this.onRectMouseUp);
	google.maps.event.addListener(this.rectMarker, 'drag', this.onRectMarkerDrag);
};

/**
 * Google Maps-DIV initialisieren
 */
GoogleMapsMediator.prototype.createMap = function(canvas)
{
	// Map initialisieren
	var mapOptions = {
		//center : new google.maps.LatLng(47.497, 7.900),
		center : new google.maps.LatLng(45.976433, 7.658448),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	return new google.maps.Map(canvas, mapOptions);
};

/**
 * Marker zum Verschieben des Rechtecks erstellen 
 */
GoogleMapsMediator.prototype.createRectMarker = function()
{
	var marker = new google.maps.Marker({draggable : true, map: this.map});
	return marker;	
};

/**
 * Auswahl-Rechteck hinzufügen
 */
GoogleMapsMediator.prototype.createRectangle = function(rectMarker)
{
	var bounds = new google.maps.LatLngBounds(		
		//new google.maps.LatLng(47.347, 7.665),
		new google.maps.LatLng(45.956433, 7.63),
		//new google.maps.LatLng(47.500, 8.143 )
		new google.maps.LatLng(46, 7.7 )
	);
	// Auswahlrechteck überlagern
	var rect = new google.maps.Rectangle({
		bounds: bounds,
		editable: true,
		draggable: true
	});
	
	// Marker zentrieren
	var sw = rect.getBounds().getSouthWest();
	var ne = rect.getBounds().getNorthEast();
	var width = ne.lng() - sw.lng();
	var height = ne.lat() - sw.lat();
	
	var middle = new google.maps.LatLng(sw.lat() + height/2.0, sw.lng() + width/2.0);
	rectMarker.setPosition(middle);
	return rect;
};

GoogleMapsMediator.prototype.updateMarkers = function()
{
	var ne = this.rect.getBounds().getNorthEast();
	var sw = this.rect.getBounds().getSouthWest();
	var nw = new google.maps.LatLng(ne.lat(), sw.lng());
	var se = new google.maps.LatLng(sw.lat(), ne.lng());
	
	this.neMarker.setPosition(ne);
	this.nwMarker.setPosition(nw);
	this.seMarker.setPosition(se);
	this.swMarker.setPosition(sw);

	this.updateInfoWindows();
};

GoogleMapsMediator.prototype.updateInfoWindows = function(){
	this.neInfo.setContent(this.getInfoWindowContent(this.neInfo.getPosition()));
	this.nwInfo.setContent(this.getInfoWindowContent(this.nwInfo.getPosition()));
	this.seInfo.setContent(this.getInfoWindowContent(this.seInfo.getPosition()));
	this.swInfo.setContent(this.getInfoWindowContent(this.swInfo.getPosition()));
};

GoogleMapsMediator.prototype.getInfoWindowContent = function(position){
	return "<strong>Lat:</strong> " + position.lat() + "<br/>"
		 + "<strong>Lng:</strong>" + position.lng();
};

/**
 * Update circles 
 */
GoogleMapsMediator.prototype.updateCircles = function(coordinates){
	$.each(self.circles, function(index){
		self.circles[index].setMap(null);
		self.circles[index].setVisible(false);
	});
	self.circles = [];
	
	$.each(coordinates, function(i){
		var latLng = coordinates[i];
		var circle = new google.maps.Marker({
			position: latLng,
			map: self.map,
			icon: {
			    path: google.maps.SymbolPath.CIRCLE,
			    fillOpacity: 1,
			    fillColor: 'ff0000',
			    strokeColor: 'ff0000',
			    strokeWeight: 0, 
			    scale: 3 //pixels
			  }
		});
		/*
		google.maps.event.addListener(circle, 'mouseover', function(event){
			onCircleMouseOver(circle, x, y);
		});
		*/
		self.circles.push(circle);
	});
};

/*
 * Update coordinates depending on rect bounds
 */
GoogleMapsMediator.prototype.getCoordinates = function(gridSize){
	var coordinates = [];
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
};

/**********************************************************
 * EVENT HANDLERS
 *********************************************************/
/**
 * Event handler für Marker-Dragged 
 * @param {Object} event
 */
GoogleMapsMediator.prototype.onRectMarkerDrag = function(event)
{
	var lat = event.latLng.lat();
	var lng = event.latLng.lng();
	var sw = self.rect.getBounds().getSouthWest();
	var ne = self.rect.getBounds().getNorthEast();
	var width = ne.lng() - sw.lng();
	var height = ne.lat() - sw.lat();
	
	var newSW = new google.maps.LatLng(lat - height/2.0, lng - width/2.0);
	var newNE = new google.maps.LatLng(lat + height/2.0, lng + width/2.0);
	var bounds = new google.maps.LatLngBounds(newSW, newNE);
	self.rect.setOptions({bounds: bounds});
};

/**
 * Event handler für Marker-Dragged 
 * @param {Object} event
 */
GoogleMapsMediator.prototype.onMarkerDragged = function(event){

};

/*
 * Update properties of rect
 */
GoogleMapsMediator.prototype.onRectBoundsChanged = function(event)
{
    // var ne = self.rect.getBounds().getNorthEast();
    // var sw = self.rect.getBounds().getSouthWest();
    // var nw = new google.maps.LatLng(ne.lat(), sw.lng());
    // var se = new google.maps.LatLng(sw.lat(), ne.lng());
//     
    // self.neMarker.setPosition(ne);
    // self.nwMarker.setPosition(nw);
    // self.seMarker.setPosition(se);
    // self.swMarker.setPosition(sw);
};

GoogleMapsMediator.prototype.onCircleMouseOver = function(circle, x, y)
{
	if(this.lastTableCell)
		$(lastTableCell).css('background-color', '#FFFFFF');
	var row = $("#points tr").eq(x+1);
	var cell = $('td', row).eq(y+1);
	$(cell).css('background-color', '#FFFF00');
	lastTableCell = cell;
};