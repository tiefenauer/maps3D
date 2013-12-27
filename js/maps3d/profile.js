var camera;
var renderer;
var plane;
var scene;
var angularSpeed = 0.2; 
var lastTime = 0;
var CANVAS_WIDTH = 1000,
	CANVAS_HEIGHT= 500;
var controls;

function initWebGL()
{
	$("#canvas-container").empty();
 	renderer = setupRenderer();
  	scene = setupScene();
  	//plane = setupPlane(100, 100, segments);
  	camera = setupCamera();
  	controls = setupControls();

	//camera.lookAt( scene.position );
	addLight(scene);
  	scene.add(camera);
  	//scene.add(plane);

	$("#canvas-container").append(renderer.domElement);
	animate();
}

/**
 * Renderer initialisieren 
 */
function setupRenderer()
{
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
      return renderer;
}

/**
 * Scene initialisieren 
 */
function setupScene()
{
      scene = new THREE.Scene();
      return scene;
}

/**
 * Kamera initialisieren 
 */
function setupCamera()
{
      var camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
      camera.position.z = 200;
      return camera;
}

/**
 * Maussteuerung initialisieren 
 */
function setupControls()
{
  	controls = new THREE.OrbitControls(camera, renderer.domElement);
	return controls;
}

/**
 * Ebene initialisieren 
 * @param {Object} width
 * @param {Object} height
 * @param {Object} segments
 */
function setupPlane(width, height, segments)
{
	var plane = new THREE.Mesh(	new THREE.PlaneGeometry( width, height, segments, segments), 
  								new THREE.MeshLambertMaterial({color: 'white', wireframe: false }));
	plane.overdraw = true;
	plane.material.side = THREE.DoubleSide;
	plane.rotation.x = Math.PI * 0.7;
	plane.rotation.z = Math.PI * 0.2;
	plane.geometry.dynamic = true;
	
	return plane;
}

/**
 * Es werde Licht 
 * @param {Object} scene
 */
function addLight(scene)
{
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(-100,200,100);
	scene.add(pointLight);
	
	pointLight = new THREE.PointLight(0xff0000);
	pointLight.position.set(100, -100, -100);
	scene.add(pointLight);
}

/*
function animate(plane, scene, camera, renderer){
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	plane.rotation.z += angleChange;
	lastTime = time;
	
    render();
    // request new frame
	requestAnimationFrame(function(){
        animate(plane, scene, camera, renderer);
    });
}
*/

function animate(){
	requestAnimationFrame(animate);
	render();
	controls.update();
}

function updatePlane(width, height, segments){
	initWebGL();
	plane = setupPlane(width, height, segments);
	scene.add(plane);
	
    render();
}

function render(){
	renderer.render(scene, camera);
}

 

