MapProfileMediator.CANVAS_WIDTH = 1000;
MapProfileMediator.CANVAS_HEIGHT= 500;

/**
 * Constructor 
 */
function MapProfileMediator(canvas)
{
	$(canvas).empty();
	this.renderer = this.setupRenderer();
	this.scene = this.setupScene();
	this.camera = this.setupCamera();
	
	this.initialize();
	
}


/**
 * 
 */
MapProfileMediator.prototype.setElevationPoints = function(elevationPoints)
{
	this.elevationPoints = elevationPoints;
};

/**
 * Zeichne Höhenprofil 
 */
MapProfileMediator.prototype.draw = function()
{
	if (this.elevationPoints){
		var properties = this.getProfileProperties();
		var sw = {'lat': properties.minLat, 'lng': properties.minLng};
		var nw = {'lat': properties.maxLat, 'lng': properties.minLng};
		var ne = {'lat': properties.maxLat, 'lng': properties.maxLng};
		
		var width = Math.floor(degreeToMeter(sw, nw) / 1000);
		var height = Math.floor(degreeToMeter(nw, ne) / 1000);
		var segments = properties.segments - 1;
		
		this.scene.remove(this.profile);
		var plane = this.setupPlane(width, height, segments);
		this.profile = this.createProfileFromPlane(plane, properties.minElev, properties.maxElev, this.elevationPoints);
		this.scene.add(this.profile);
		
		$("#canvas-container").append(this.renderer.domElement);
		this.controls = this.setupControls();
		this.render();
	};
	self = this;
	lastTime = 0;
	function animate() {
		requestAnimationFrame(animate);
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = 0.2 * timeDiff * 2 * Math.PI / 1000;
        self.profile.rotation.z += angleChange;
        lastTime = time;		
		self.render();
		self.controls.update();
	};
	animate();
};

/**
 * Breite und Länge des Profile ermitteln 
 */
MapProfileMediator.prototype.getProfileProperties = function()
{
	var minLat=Infinity, maxLat=0, minLng=Infinity, maxLng=0, maxElev=0, minElev=Infinity;
	$.each(this.elevationPoints, function(index, elevationPoint){
		if (elevationPoint.lat < minLat) minLat = elevationPoint.lat;
		if (elevationPoint.lng < minLng) minLng = elevationPoint.lng;
		if (elevationPoint.elevation < minElev) minElev = elevationPoint.elevation;
		if (elevationPoint.lat > maxLat) maxLat = elevationPoint.lat;
		if (elevationPoint.lng > maxLng) maxLng = elevationPoint.lng;
		if (elevationPoint.elevation > maxElev) maxElev = elevationPoint.elevation;
	});
	
	var segments = Math.sqrt(this.elevationPoints.length);
	return {'minLat': minLat, 'maxLat': maxLat, 'minLng': minLng, 'maxLng': maxLng, 'maxElev': maxElev, 'minElev': minElev, 'segments': segments};
};

/**
 * Aus einer Fläche die einzelnen Punkte verändern 
 */
MapProfileMediator.prototype.createProfileFromPlane = function(plane, minElev, maxElev, elevationPoints)
{
	//var max = 20, min=0;
	var diff = (maxElev - minElev);
	for(var i=0; i < plane.geometry.vertices.length; i++){
		//var rand = Math.random() * (max - min) + min;
		plane.geometry.vertices[i].z -= Math.abs(elevationPoints[i].elevation - diff) / 1000; 
	}
	plane.geometry.__dirtyVertices = true;
	plane.geometry.computeCentroids();
	return plane;
};

MapProfileMediator.prototype.startAnimation = function()
{
	this.animate();
};

MapProfileMediator.prototype.render = function()
{
	this.renderer.render(this.scene, this.camera);
};

/**
 * Ebene initialisieren 
 * @param {Object} width
 * @param {Object} height
 * @param {Object} segments
 */
MapProfileMediator.prototype.setupPlane = function(width, height, segments)
{
	var plane = new THREE.Mesh(	new THREE.PlaneGeometry( width, height, segments, segments), 
  								new THREE.MeshLambertMaterial({color: 'white', wireframe: false })
  								);
	plane.overdraw = true;
	plane.material.side = THREE.DoubleSide;
	plane.rotation.x = Math.PI * 0.7;
	plane.rotation.z = Math.PI * 0.2;
	plane.geometry.dynamic = true;
	plane.receiveShadow = true;
	plane.castShadow = true;
	
	return plane;
};

/**
 * Initialisierung 
 */
MapProfileMediator.prototype.initialize = function()
{
	this.addLight(this.scene);
  	this.scene.add(this.camera);
};

/**
 * Renderer initialisieren 
 */
MapProfileMediator.prototype.setupRenderer = function(){
      var renderer = new THREE.WebGLRenderer();
      renderer.shadowMapEnabled = true;
      renderer.setSize( MapProfileMediator.CANVAS_WIDTH, MapProfileMediator.CANVAS_HEIGHT );
      return renderer;
};

/**
 * Scene initialisieren 
 */
MapProfileMediator.prototype.setupScene = function()
{
      scene = new THREE.Scene();
      return scene;
};

/**
 * Kamera initialisieren 
 */
MapProfileMediator.prototype.setupCamera = function()
{
      var camera = new THREE.PerspectiveCamera(45, MapProfileMediator.CANVAS_WIDTH / MapProfileMediator.CANVAS_HEIGHT, 1, 1000);
      camera.position.z = 10;
      return camera;
};


/**
 * Maussteuerung initialisieren 
 */
MapProfileMediator.prototype.setupControls = function()
{
  	controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  	//controls = new THREE.TrackballControls(this.camera);
	return controls;
};

/**
 * Es werde Licht 
 * @param {Object} scene
 */
MapProfileMediator.prototype.addLight = function (scene)
{
	// var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	// directionalLight.position.set (0, 10, 0);
	// scene.add(directionalLight);
	
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -10, 10, 10 );
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    spotLight.shadowCameraNear = 5;
    spotLight.shadowCameraFar = 20;
    spotLight.shadowCameraFov = 70;
    spotLight.shadowCameraVisible = true;
    scene.add( spotLight );
	
	// var pointLight = new THREE.PointLight(0xffffff);
	// pointLight.position.set(0,2000,0);
	// pointLight.castShadow = true;
	// scene.add(pointLight);
	
	 // var spotLight = new THREE.SpotLight(0xffffff);
	 // spotLight.position.set(10, 10, 10);
	 // scene.add(spotLight);
// 	
	pointLight = new THREE.PointLight(0xff0000);
	pointLight.position.set(-10, 10, 10);
	pointLight.castShadow = true;
    pointLight.shadowMapWidth = 1024;
    pointLight.shadowMapHeight = 1024;
    pointLight.shadowCameraNear = 5;
    pointLight.shadowCameraFar = 20;
    pointLight.shadowCameraFov = 70;
    pointLight.shadowCameraVisible = true;
	//scene.add(pointLight);
};
