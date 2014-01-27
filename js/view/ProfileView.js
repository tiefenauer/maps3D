define([
	'backbone', 
	'THREE', 
	'model/ProfilePoints', 
	'util/GoogleMapsUtil',
	'libs/three/controls/TrackballControls', 
	'libs/three/controls/OrbitControls'
	], 
	function(Backbone, THREE, ProfilePoints, GoogleMapsUtil){

		/**
		* ProfileView
		*/
		var ProfileView = Backbone.View.extend({
			model: ProfilePoints,

			initialize: function(){
				var width = this.$el.width();
				var height = this.$el.height();
				console.log("new ProfileView created: " + width + '/' + height);
				
				// scene
				scene = new THREE.Scene();

				//camera
				var camera = new THREE.PerspectiveCamera(45,  width/height, 1, 1000);
				camera.position.set(50,50,50);
				camera.lookAt(scene.position);
				scene.add(camera);

				// lighting
		        var spotLight = new THREE.SpotLight( 0xffffff, 4 );
		        spotLight.position.set( 170, 40, 0 );
		        scene.add( spotLight );
		        

				// red=X, green=Y, blue=Z
				// inset AxisHelper: http://jsfiddle.net/CBAyS/21/
				// Helpers: http://danni-three.blogspot.ch/2013/09/threejs-helpers.html
				var axis = new THREE.AxisHelper(100);
				scene.add(axis);
				var grid = new THREE.GridHelper(10,1);
				scene.add(grid);

				this.$el.empty();

				// renderer
				var renderer = new THREE.WebGLRenderer({ antialias: true });
				renderer.setSize( width, height );
				this.$el.append(renderer.domElement);
				
		        renderer.setClearColor(0x000000, 1)
		        renderer.shadowMapEnabled = true;
		        renderer.shadowMapDarkness = 10;
		        renderer.shadowMapSoft = false;
		        renderer.shadowMapType = THREE.BasicShadowMap;
		        renderer.physicallyBasedShading = true;
				//renderer.shadowMapWidth = 1024;
				//renderer.shadowMapHeight = 1024;
				

			    this.renderer = renderer;
			    this.scene = scene;
			    this.camera = camera;
			    this.spotLight = spotLight;
			    this.objects = [];

				this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
				this.render();

			},

			clearScene: function()
			{
				_.each(this.objects, function(object){
					this.scene.remove(object);
				})
			},

			draw: function(elevationPoints){
				this.clearScene();

				// Höhe/Breite und Anzahl Segments berechnen
				var minLng = _.min(elevationPoints.pluck('lng'));
				var maxLng = _.max(elevationPoints.pluck('lng'));
				var minLat = _.min(elevationPoints.pluck('lat'));
				var maxLat = _.max(elevationPoints.pluck('lat'));
				var minElv = _.min(elevationPoints.pluck('elv'));
				var maxElv = _.max(elevationPoints.pluck('elv'));

				var sw = {'lat': minLat, 'lng': minLng};
				var nw = {'lat': maxLat, 'lng': minLng};
				var ne = {'lat': maxLat, 'lng': maxLng};
				var width = Math.floor(GoogleMapsUtil.degreeToMeter(sw, nw) / 100);
				var height = Math.floor(GoogleMapsUtil.degreeToMeter(nw, ne) / 100);
				var segments = Math.sqrt(elevationPoints.length) - 1;
				
				// Ebene konstruieren
		        var plane = new THREE.Mesh( new THREE.PlaneGeometry(width, height, segments, segments ),
		                                  new THREE.MeshLambertMaterial({color: 0x00ff00, dynamic: true})
		                                );
				var wireframe = new THREE.Mesh( new THREE.PlaneGeometry(width, height, segments, segments ),
		                                  new THREE.MeshLambertMaterial({color: 0x000000, wireframe: true, dynamic: true})
		                                );

				// Höhen der Punkte anpassen
				var diff = (maxElv - minElv);
		        plane.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		        wireframe.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				for(var i=0; i < plane.geometry.vertices.length; i++){
					plane.geometry.vertices[i].z += Math.abs(elevationPoints.models[i].get('elv') - diff) / 100; 
					wireframe.geometry.vertices[i].z += Math.abs(elevationPoints.models[i].get('elv') - diff) / 100; 
				}
		        plane.geometry.__dirtyVertices = true;
		        wireframe.geometry.__dirtyVertices = true;
		        plane.geometry.computeCentroids();
		        wireframe.geometry.computeCentroids();

		        this.scene.add(plane);
		        this.scene.add(wireframe);
		        this.objects.push(plane, wireframe);
			},

			/**
			* Einzelnes Frame rendern
			*/
			render: function(){
				self = this;
				lastTime = 0;
				var animate = function(){
					requestAnimationFrame(animate);
			        // update
			        var time = (new Date()).getTime();
			        var timeDiff = time - lastTime;
			        var angleChange = 0.2 * timeDiff * 2 * Math.PI / 1000;
			        //self.profile.rotation.z += angleChange;
			        lastTime = time;		
					self.renderer.render(self.scene, self.camera);
					self.controls.update();
				};
				animate();
			}

	},
	{
		CANVAS_WIDTH: 400,
		CANVAS_HEIGHT: 400		
	});
	return ProfileView;
});	
