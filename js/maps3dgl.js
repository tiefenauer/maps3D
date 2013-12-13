var camera;
var renderer;
var plane;
var scene;
var angularSpeed = 0.2; 
var lastTime = 0;
var CANVAS_WIDTH = 1000,
	CANVAS_HEIGHT= 500;

function initWebGL()
{
	$("#canvas-container").empty();
 	renderer = setupRenderer();
  	scene = setupScene();
  	//plane = setupPlane(100, 100, segments);
  	camera = setupCamera();

	//camera.lookAt( scene.position );
	addLight(scene);
  	scene.add(camera);
  	//scene.add(plane);

	$("#canvas-container").append(renderer.domElement);
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

function setupPlane(width, height, segments)
{
	var plane = new THREE.Mesh(	new THREE.PlaneGeometry( width, height, segments, segments), 
  								new THREE.MeshLambertMaterial({color: 'blue', wireframe: true }));
	plane.overdraw = true;
	plane.material.side = THREE.DoubleSide;
	plane.rotation.x = Math.PI * 0.7;
	plane.rotation.z = Math.PI * 0.2;
	plane.geometry.dynamic = true;
	
	return plane;
}

function addLight(scene)
{
      // add subtle ambient lighting
      var ambientLight = new THREE.AmbientLight(0xFFFFFF	);
      scene.add(ambientLight);
      
      // directional lighting
      var pointLight = new THREE.PointLight(0xffffff, 2.0);
      //pointLight.position.set(1, 1, 1).normalize();
      scene.add(pointLight);
}

function animate(plane, scene, camera, renderer){
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	plane.rotation.z += angleChange;
	lastTime = time;
	
    renderer.render(scene, camera);
    // request new frame
	requestAnimationFrame(function(){
        animate(plane, scene, camera, renderer);
    });
}

function updatePlane(width, height, segments){
	initWebGL();
	plane = setupPlane(width, height, segments);
	scene.add(plane);
	
    renderer.render(scene, camera);
}
 

