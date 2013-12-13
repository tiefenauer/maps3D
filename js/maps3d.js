var map;
var rect;
var coordinates = [];
var elevations = [];
var neMarker, neInfo;
var nwMarker, nwInfo;
var seMarker, seInfo;
var swMarker, swInfo;
var circles = [];

/*
 * Initialize Objects
 */
function initialize() {	
	var mapOptions = {
		center : new google.maps.LatLng(47.497, 7.900),
		zoom : 10,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map($("#map-canvas")[0], mapOptions);
	
	var bounds = new google.maps.LatLngBounds(		
		new google.maps.LatLng(47.347, 7.665),
		new google.maps.LatLng(47.500, 8.143 )
	);
	rect = new google.maps.Rectangle({
		bounds: bounds,
		editable: true,
		draggable: true
	});
	rect.setMap(map);
	google.maps.event.addListener(map, 'click', function(event) {
		log(event);
	});
	google.maps.event.addListener(rect, 'bounds_changed', onRectBoundsChanged);
	google.maps.event.addListener(rect, 'mousedown', onRectMouseDown);
	google.maps.event.addListener(rect, 'mouseup', onRectMouseUp);
	
	initHTML();
	initMarkers();
	
	neInfo = new google.maps.InfoWindow();
	nwInfo = new google.maps.InfoWindow();
	seInfo = new google.maps.InfoWindow();
	swInfo = new google.maps.InfoWindow();
	
	updateMarkers();
	updateCoordinates();
	updatePointsTable();
	
	neInfo.open(map, neMarker);
	nwInfo.open(map, nwMarker);
	seInfo.open(map, seMarker);
	swInfo.open(map, swMarker);
	
	redraw();
	getProfileData();
	updateWebGL();
}

/*
 * Init HTML components
 */
function initHTML()
{
	initWebGL();
	$("#slider").slider()
		.on('slideStop', onSliderValueChanged);
	$("#submitBtn").click(function(event){
		// update plane with heights
	});
}

function initMarkers(){
	neMarker = new google.maps.Marker({draggable : true, map: map});
	seMarker = new google.maps.Marker({draggable : true, map: map});
	nwMarker = new google.maps.Marker({draggable : true, map: map});
	swMarker = new google.maps.Marker({draggable : true, map: map});
	
	google.maps.event.addListener(neMarker, 'dragend', function(event){
		updateRectBounds();
	});
	google.maps.event.addListener(neMarker, 'drag', function(event){
		neInfo.setContent(getInfoWindowContent(neInfo));
	});
	google.maps.event.addListener(nwMarker, 'dragend', function(event){
		neMarker.setPosition(new google.maps.LatLng(nwMarker.getPosition().lat(), neMarker.getPosition().lng()));
		swMarker.setPosition(new google.maps.LatLng(swMarker.getPosition().lat(), nwMarker.getPosition().lng()));
		updateRectBounds();
	});
	google.maps.event.addListener(nwMarker, 'drag', function(event){
		nwInfo.setContent(getInfoWindowContent(nwInfo));
	});
	google.maps.event.addListener(seMarker, 'dragend', function(event){
		neMarker.setPosition(new google.maps.LatLng(neMarker.getPosition().lat(), seMarker.getPosition().lng()));
		swMarker.setPosition(new google.maps.LatLng(seMarker.getPosition().lat(), swMarker.getPosition().lng()));
		updateRectBounds();
	});
	google.maps.event.addListener(seMarker, 'drag', function(event){
		seInfo.setContent(getInfoWindowContent(seInfo));
	});	
	google.maps.event.addListener(swMarker, 'dragend', function(event){
		updateRectBounds();
	});
	google.maps.event.addListener(swMarker, 'drag', function(event){
		swInfo.setContent(getInfoWindowContent(swInfo));
	});
}
/*
 * Get Profile
 */
function getProfileData()
{
	var loc = [];
	for(var x=0;x<coordinates.length;x++){
		var row = coordinates[x];
		for (var y=0;y<row.length;y++){
			loc.push(coordinates[x][y]);
		}
	};
	var service = new google.maps.ElevationService();
	var request = {'locations': loc};
	var result = service.getElevationForLocations(request, onServiceCompleted);
}

/**
 * Service response handler 
 */
function onServiceCompleted(result, status){
	log('Elevation service request: ' + status);
	log('Number of elevations : ' + result.length);

	var num = $('#slider').slider('getValue').val();
	var i=0;
	for(var x=0;x<num;x++){
		elevations[x] = [];
		for(var y=0;y<num;y++){
			var elev = result[i];
			elevations[x][y] = elev;
			i++;
		}
	}
		
	updateElevations();
}

/*
 * Update properties of rect
 */
function onRectBoundsChanged(event)
{
	resetCircles();
	updateMarkers();
	updateCoordinates();
	updatePointsTable();
	updateCircles();
	updateWebGL();
}

function onSliderValueChanged(event)
{
	resetValues();
	updateCoordinates();
	updatePointsTable();
	updateCircles();
	getProfileData();
	updateWebGL();
}

function onRectMouseDown(event)
{
	resetValues();
}

function onRectMouseUp(event)
{
	redraw();
	getProfileData();
}

var lastTableCell;
function onCircleMouseOver(circle, x, y)
{
	if(lastTableCell)
		$(lastTableCell).css('background-color', '#FFFFFF');
	var row = $("#points tr").eq(x+1);
	var cell = $('td', row).eq(y+1);
	$(cell).css('background-color', '#FFFF00');
	lastTableCell = cell;
}

function resetCircles(){
	$.each(circles, function(index){
		circles[index].setMap(null);
		circles[index].setVisible(false);
	});
}
/**
 * Update circles 
 */
function updateCircles(){
	$.each(coordinates, function(x){
		var row = coordinates[x];
		$.each(row, function(y){
			var latLng = coordinates[x][y];
			var circle = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: {
				    path: google.maps.SymbolPath.CIRCLE,
				    fillOpacity: 1,
				    fillColor: 'ff0000',
				    strokeColor: 'ff0000',
				    strokeWeight: 0, 
				    scale: 3 //pixels
				  }
			});
			circle.x = x;
			circle.y = y;
			google.maps.event.addListener(circle, 'mouseover', function(event){
				onCircleMouseOver(circle, x, y);
			});
			circles.push(circle);
		});
	});
}

function resetValues()
{
	resetCircles();
}

function redraw()
{
	elevations = [];
	updateCoordinates();
	updateMarkers();
	updatePointsTable();
	updateCircles();
}
/*
 * Update coordinates depending on rect bounds
 */
function updateCoordinates(){
	coordinates = [];
	var ne = rect.getBounds().getNorthEast();
	var sw = rect.getBounds().getSouthWest();
	var nw = new google.maps.LatLng(ne.lat(), sw.lng());
	var se = new google.maps.LatLng(sw.lat(), ne.lng());
	
	var num = $('#slider').slider('getValue').val();
	// get values on x-axis
	var xFrom = nw.lng();
	var xTo = ne.lng();	
	var xStep = (xTo-xFrom)/(num-1);
	// get values on y-axis
	var yFrom = se.lat();
	var yTo = ne.lat();
	var yStep = (yTo-yFrom)/(num-1);
	
	for(var y=0; y<num; y++){
		yVal = yTo - y*yStep;
		
		coordinates[y] = [];
		for (var x=0; x<num; x++){
			xVal = xFrom + x*xStep;
			var latLng = new google.maps.LatLng(yVal, xVal);
			coordinates[y][x] = latLng;
		}
	}
}
function updateMarkers(){
	
	var ne = rect.getBounds().getNorthEast();
	var sw = rect.getBounds().getSouthWest();
	var nw = new google.maps.LatLng(ne.lat(), sw.lng());
	var se = new google.maps.LatLng(sw.lat(), ne.lng());
	
	neMarker.setPosition(ne);
	nwMarker.setPosition(nw);
	seMarker.setPosition(se);
	swMarker.setPosition(sw);

	updateInfoWindows();
}

function updateInfoWindows(){
	neInfo.setContent(getInfoWindowContent(neInfo));
	nwInfo.setContent(getInfoWindowContent(nwInfo));
	seInfo.setContent(getInfoWindowContent(seInfo));
	swInfo.setContent(getInfoWindowContent(swInfo));
}

function updateRectBounds(){
	rect.setBounds(new google.maps.LatLngBounds(swMarker.getPosition(), neMarker.getPosition()));
	redraw();
	getProfileData();
}

function getInfoWindowContent(infoWindow){
	
	var lat;
	var lng;
	switch(infoWindow){
		case neInfo:
			lat = neMarker.getPosition().lat();
			lng = neMarker.getPosition().lng();
			break;
		case nwInfo:
			lat = nwMarker.getPosition().lat();
			lng = nwMarker.getPosition().lng(); 
			break;
		case seInfo:
			lat = seMarker.getPosition().lat();
			lng = seMarker.getPosition().lng();
			break;
		case swInfo:
			lat = swMarker.getPosition().lat();
			lng = swMarker.getPosition().lng();
			break;
		
	}
	
	return "<strong>Lat:</strong> " + lat + "<br/>"
		 + "<strong>Lng:</strong>" + lng;
}

/*
 * Update points table with coordinates
 */
function updatePointsTable(){
	$('#points').empty();
	$.each(coordinates, function(y, points){
		var row = $('<tr></tr>');
		if(y == 0){
			$(row).append('<td></td>');
			$.each(points, function(x, latLng){
				var td = $('<td></td>');
				$(td).css("background-color", "#000000");
				$(td).css("color", "#FFF");
				$(td).html(Number(latLng.lng()).toFixed(2));
				$(row).append(td);
			});
			$('#points').append(row);
			
			var secondRow = $('<tr></tr>');
			var td = $('<td></td>').html(Number(points[0].lat()).toFixed(2));
			$(td).css("background-color", "#000000");
			$(td).css("color", "#FFF");
			$(secondRow).append(td);
			$.each(points, function(x, latLng){
				$(secondRow).append('<td></td>');
			});
			$('#points').append(secondRow);
		}
		else{
			var td = $('<td></td>').html(Number(points[0].lat()).toFixed(2));
			$(td).css("background-color", "#000000");
			$(td).css("color", "#FFF");
			$(row).append(td);
			$.each(points, function(x, latLng){
				$(row).append('<td></td>');
			});
			$('#points').append(row);
		}
	});
}

/**
 * Update points with coordinates 
 */
function updateElevations(){
	var rows = $("#points tr");
	rows.each(function(y){
		if (y>0){
			$(this).children('td').each(function(x){
				if (x>0){
					var elev = elevations[y-1][x-1];
					$(this).html('<strong>' + Number(elev.elevation).toFixed(3) + '</strong>');
				}
			});
		};
	});
}

/**
 * Update Plane with
 * - Rect bounds/ratio
 * - number of segments
 */
function updateWebGL()
{
	console.log('updating mesh');
	var ne = rect.getBounds().getNorthEast();
	var sw = rect.getBounds().getSouthWest();
	
	var width = (ne.lng() - sw.lng()) * 200;
	var height = (ne.lat() - sw.lat()) * 200;
	var segments = $('#slider').slider('getValue').val();
	
	updatePlane(width, height, segments);
}
/*
 * Log functions
 */
function log(str)
{
	$("#log textarea").val($("#log textarea").val() + str + "\r\n");
	$("#log textarea")[0].scrollTop = $("#log textarea")[0].scrollHeight;
}
