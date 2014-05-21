/**
* info.tiefenauer.maps3d.view.GoogleMapsView
* View-Class for the DOM element displaying the GoogleMap with the selection rectangle.
* (c) 2014 Daniel Tiefenauer
* @author: Daniel Tiefenauer
*/
define([
	'jquery', 
	'underscore', 
	'backbone',
	'model/ProfilePoints',
	'gmaps',
	'bootstrap_slider'	
	],
	function($, _, Backbone, ProfilePoints, ProfilePoint, gmaps){

		/**
		* GoogleMapsView
		*/
		var GoogleMapsView = Backbone.View.extend({

			map: null,
			rect: new google.maps.Rectangle({editable: true, draggable: true}),
			searchInput: null,
			searchBox: null,

			/**
			* Initialize GoogleMap by adding a selection rectangle and registering event handlers
			*/
			initialize: function(options){
				console.log('new GoogleMapsView created');
				this.on = this.vent.on;
				this.trigger = this.vent.trigger;

				this.__defineGetter__('coordinates', function(){ return this.getCoordinates()});
				this.__defineSetter__('gridSize', function(value){
					localStorage.setItem('resolution', value);
					this.horizontalSegments = value;
					this.verticalSegments = value;
					this.trigger('rect:grid:changed', this.horizontalSegments, this.verticalSegments);
					this.triggerRectChange();
				})

				this.map = new google.maps.Map(this.el, {
					center : new google.maps.LatLng(45.976433, 7.658448), // Matterhorn
					zoom : 12,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					scrollwheel: false,
					zoomControl: false
				});

				this.markers = [];
				this.searchInput = $("#pac-input")[0];
				this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.searchInput);
				this.searchBox = new google.maps.places.SearchBox(this.searchInput);

				mapView = this;
				google.maps.event.addListener(this.rect, 'mouseup', this.onRectMouseUp);
				google.maps.event.addListener(this.rect, 'mouseDown', this.onRectMouseDown);
				google.maps.event.addListener(this.rect, 'bounds_changed', this.onRectBoundsChanged);
				google.maps.event.addListener(this.searchBox, 'places_changed', this.onPlacesChanged);
				this.mapBoundChangeListener = google.maps.event.addListener(this.map, 'dragend', this.onMapBoundsChanged);
				
				var resolution = localStorage.getItem('resolution');
				this.gridSize = (resolution)?resolution:45;
				this.render();
			},

			/**
			* Center selection rectangle over map
			*/
			render: function(){
				console.log('rendering GoogleMapsView');				
	
				// Auswahlrechteck erstellen
				this.rect.setMap(this.map);
				this.rect.setBounds(new google.maps.LatLngBounds(		
					new google.maps.LatLng(45.956433, 7.63),
					new google.maps.LatLng(46, 7.7 )
				));		

				this.triggerRectChange();
			},

			/**
			* Rasterize selection rectangle to determine points for which the elevation must be determined.
			* @return a ProfilePoint object with all the coordinates from the rasterized selection rectangle. The elevation is zero for each poitn.
			*/
			getCoordinates: function(){
				var resolution = localStorage.getItem('resolution');
				this.gridSize = (resolution)?resolution:45;

				// Positionen der Ecken bestimmen
				var ne = this.rect.getBounds().getNorthEast();
				var sw = this.rect.getBounds().getSouthWest();
				var nw = new google.maps.LatLng(ne.lat(), sw.lng());
				var se = new google.maps.LatLng(sw.lat(), ne.lng());
				
				// get values on x-axis
				var xFrom = nw.lng();
				var xTo = ne.lng();	
				var xStep = (xTo-xFrom)/(this.horizontalSegments - 1);
				
				// get values on y-axis
				var yFrom = se.lat();
				var yTo = ne.lat();
				var yStep = (yTo-yFrom)/(this.verticalSegments - 1);
				
				var profilePoints = new ProfilePoints();
				for(var y=0; y<this.verticalSegments; y++){
					yVal = yTo - y*yStep;
					
					for (var x=0; x<this.horizontalSegments; x++){
						xVal = xFrom + x*xStep;
						profilePoints.add({lng: Number(parseFloat(xVal).toFixed(4)), lat: Number(parseFloat(yVal).toFixed(4))});
					}
				}
				return profilePoints;
			},

			/**
			* Trigger event if rectangle has changed in any way
			*/ 
			triggerRectChange: function(){
				this.trigger('rect:changed', this.rect.getBounds(), this.horizontalSegments, this.verticalSegments);
			},

			/*
			* Event handler: MouseUp on selection rectangle
			*/
			onRectMouseUp: function()
			{
				this.mouseUp = true;
			},
			/*
			* Event handler: MouseDown on selection rectangle
			*/
			onRectMouseDown: function()
			{
				this.mouseUp = false;
			},
			/*
			* Event handler: Bounds of selection rectangle have changed
			*/			
			onRectBoundsChanged: function()
			{
				console.log('changing rect');
				mapView.trigger('rect:bounds:changing');
				if (this.mouseUp)
					mapView.trigger('rects:bounds:changed')
				mapView.triggerRectChange();
			},
			/**
			* Event handler: Bounds of map have changed
			*/
			onMapBoundsChanged: function() {
				// Listener temporär entfernen
				google.maps.event.removeListener(mapView.mapBoundChangeListener);
				mapView.map.setZoom(14);
				var bounds = mapView.map.getBounds();

				// Rechteck zentrieren
				mapView.rect.setBounds(bounds);

				mapView.map.setZoom(12);
				// Suche gewichten zugunsten von Orten innerhalb des angezeigten Bereichs
		    	mapView.searchBox.setBounds(bounds);

		    	// Listener wieder hinzufügen
				setTimeout(function(){ mapView.mapBoundChangeListener = google.maps.event.addListener(mapView.map, 'dragend', mapView.onMapBoundsChanged)}, 100);
		  	},
		  	/**
		  	* Event handler: User selected a place from the dropdown list
		  	*/
			onPlacesChanged : function() {
			    var places = mapView.searchBox.getPlaces();

			    for (var i = 0, marker; marker = mapView.markers[i]; i++) {
			      marker.setMap(null);
			    }

			    // For each place, get the icon, place name, and location.
			    markers = [];
			    var bounds = new google.maps.LatLngBounds();
			    for (var i = 0, place; place = places[i]; i++) {
			    	var image = {
				        url: place.icon,
				        size: new google.maps.Size(71, 71),
				        origin: new google.maps.Point(0, 0),
				        anchor: new google.maps.Point(17, 34),
				        scaledSize: new google.maps.Size(25, 25)
			      	};

			      	// Create a marker for each place.
			      	var marker = new google.maps.Marker({
				        map: mapView.map,
				        icon: image,
				        title: place.name,
				        position: place.geometry.location
			      	});

			      	markers.push(marker);

		      		bounds.extend(place.geometry.location);
			    }

			    mapView.map.fitBounds(bounds);
			    mapView.onMapBoundsChanged();
		  	}

		});	

		return GoogleMapsView;

});