var mapMediator, mapProfileMediator, adapter;

/**
 * HTML-GUI initialisieren 
 */
function init() {	
	mapMediator = new GoogleMapsMediator($("#map-canvas")[0]);
	mapProfileMediator =  new MapProfileMediator($("#profile-canvas")[0]);
	adapter = new GoogleMapsAdapter();
	
	initHTML();
}


/*
 * Init HTML components
 */
function initHTML()
{
	//initWebGL();
	$("#slider").slider().on('slideStop', onSliderValueChanged);
	$("#submitBtn").click(onSubmitButtonClick);
}


/**********************************************************
 * EVENT HANDLERS
 *********************************************************/

function onSliderValueChanged(event)
{
	var coordinates = mapMediator.getCoordinates($('#slider').slider('getValue').val());
	//mapMediator.updateCircles(coordinates);
}

function onSubmitButtonClick(event)
{
	var gridSize = $('#slider').slider('getValue').val();
	var coordinates = mapMediator.getCoordinates(gridSize);
	adapter.getProfileData(coordinates, onAdapterDataReceived);
}

function onAdapterDataReceived(elevationPoints)
{
	$('#points').empty();
	var gridSize = Number($('#slider').slider('getValue').val()) + 1;
	
	// Tabelle vorbereiten
	for(var i=0; i<gridSize; i++){
		var tr = $('<tr></tr>');
		for (var j=0; j< gridSize ; j++){
			var td = $('<td></td>');
			// erste Zeile und erste Spalte sind anders
			if (i == 0 || j == 0){
				$(td).css("background-color", "#000000");
				$(td).css("color", "#FFF");
			}
			$(tr).append(td);
		}
		$('#points').append(tr);
	};
	
	// Daten einfüllen
	var rows = $("#points tr");
	rows.each(function(y){
		if (y>0){
			$(this).children('td').each(function(x){
				if (x>0){
					var index = (y-1)*(gridSize-1) + (x-1);
					var lat = elevationPoints[index].lat;
					var lng = elevationPoints[index].lng;
					var elev = elevationPoints[index].elevation;
					$(this).html(Number(lat).toFixed(2) + '/' + Number(lng).toFixed(2) + '<br/>');
					$(this).append('<strong>' + Number(elev).toFixed(3) + '</strong>');
				}
			});
		};
	});

	mapProfileMediator.setElevationPoints(elevationPoints);
	mapProfileMediator.draw();
}
	

/**
 * Update Plane with
 * - Rect bounds/ratio
 * - number of segments
 */
function updateWebGL()
{
	log('updating mesh');
	var ne = rect.getBounds().getNorthEast();
	var sw = rect.getBounds().getSouthWest();
	
	var width = (ne.lng() - sw.lng()) * 200;
	var height = (ne.lat() - sw.lat()) * 200;
	var segments = $('#slider').slider('getValue').val();
	
}
/*
 * Log functions
 */
function log(str)
{
	$("#log textarea").val($("#log textarea").val() + str + "\r\n");
	$("#log textarea")[0].scrollTop = $("#log textarea")[0].scrollHeight;
}
