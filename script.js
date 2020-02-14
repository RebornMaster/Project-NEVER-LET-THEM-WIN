var point=0;
console.log("Hello World! point="+(++point));

window.onerror = function(message, source, lineno, colno, error) {
	console.log(message);
	console.log(error.stack);
};

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

console.log("Hello World! point="+(++point));


function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = event.clientX / window.innerWidth * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function Input() {
	this.keys = new Array(128);
	var self = this;
	for (var i = 0; i < this.keys.length; i++) {
		this.keys[i] = false;
	}
	window.onkeydown = function(e) {
		self.keys[e.keyCode] = true;
	};
	window.onkeyup = function(e) {
		self.keys[e.keyCode] = false;
	};
	this.getKey = function(key) {
		if (this.keys[key]) {
			return true;
		} else {
			return false;
		}
	};
}
var input = new Input();
console.log("Hello World! point="+(++point));

var vec3 = THREE.Vector3;
var directions = {
	up: 87,
	right: 65,
	left: 68,
	down: 83,
	strafeLeft: 81,
	strafeRight: 69
};

class Player {
	constructor(cam) {
		this.camera = cam;
		this.velocity = new vec3();
		this.angularVelocity = new vec3();
	}
	getInput() {
		var isInput = false;
		var reverseStrafe = 1;
		if (input.getKey(directions.up)) {
			this.velocity.x = -0.1;
			isInput = true;
		} else if (input.getKey(directions.down)) {
			this.velocity.x = 0.1;
			isInput = true;
		} else {
			this.velocity.x = 0;
			isInput = true;
		}

		if (input.getKey(directions.right)) {
			this.angularVelocity.y = 0.04;
			isInput = true;
		} else if (input.getKey(directions.left)) {
			this.angularVelocity.y = -0.04;
			isInput = true;
		} else {
			this.angularVelocity.y = 0;
		}

		if (input.getKey(directions.strafeLeft)) {
			this.velocity.z = -0.1;
			this.angularVelocity *= -1;
			isInput = true;
		} else if (input.getKey(directions.strafeRight)) {
			this.velocity.z = 0.1;
			this.angularVelocity *= -1;
			isInput = true;
		} else {
			this.velocity.z = 0;
		}
		return isInput;
	}
	checkForCollisions(desiredPosition) {
		return false;
	}
	move() {
		this.camera.rotateOnAxis(new vec3(0, 1, 0), this.angularVel);
		this.camera.translateOnAxis(new vec3(0, 0, 1), this.velocity.x);
		this.camera.translateOnAxis(new vec3(1, 0, 0), this.velocity.z);
	}
	update() {
		if (this.getInput()) {
			this.move();
		}
	}
}
console.log("Hello World! point="+(++point));

// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer;
var player;
init();
console.log("Hello World! point="+(++point));

animate();
console.log("Hello World! point="+(++point));

// Sets up the scene.
function init() {
	// Create the scene and set the scene size.
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth,
		HEIGHT = window.innerHeight;

	// Create a renderer and add it to the DOM.
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Create a camera, zoom it out from the model a bit, and add it to the scene.
	camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(0, 0, -2);
	camera.lookAt(0, 0, 0);
	scene.add(camera);
	player = new Player(camera);
	
	// Create an event listener that resizes the renderer with the browser window.
	window.addEventListener("resize", function() {
		var WIDTH = window.innerWidth,
			HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

	// Set the background color of the scene.
	renderer.setClearColor(0x333f47, 1);
	renderer.clearColor();
	var fog = new THREE.FogExp2(0x1565c0, 1);
	//scene.add(fog);

	
	
	
	
	// Create cubes and add them to the scene
	var geometry = new THREE.BoxGeometry(1, 1, 1);

	var mesh;
	var boxHelper;
	var box3;
	for (var i = 0; i < 60; i++) {
		var material = new THREE.MeshLambertMaterial({ color: 0x55b663 });
		mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.position.set(Math.random() * 60 - 30, 0, Math.random() * 60 - 30);
		boxHelper = new THREE.BoxHelper(mesh, 0x55b663);
		box3 = new THREE.Box3();
		box3.setFromObject(boxHelper);
		scene.add(mesh);
		scene.add(boxHelper);
	}
	var plane = new THREE.Mesh(
		new THREE.PlaneGeometry(500, 500, 50, 50),
		new THREE.MeshLambertMaterial({ color: 0x595859, side: THREE.DoubleSide })
	);
	plane.receiveShadow = true;
	plane.rotateX(Math.PI / 2);
	plane.position.set(0, -0.5, 0);
	scene.add(plane);

	var shadowMaterial = new THREE.ShadowMaterial({ color: 0xeeeeee });
	shadowMaterial.opacity = 0.5;

	var ambientLight = new THREE.AmbientLight(0x333f47);
	scene.add(ambientLight);

	// Create a light, set its position, and add it to the scene.
	var light = new THREE.PointLight(0xffffff);

	light.position.set(0, 1, 2);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.0001;
	scene.add(light);

	var sphereSize = 1;
	var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
	scene.add(pointLightHelper);
}

// Renders the scene and updates the render as needed.
function animate() {
	requestAnimationFrame(animate);
	/*
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);

	for (var i = 0; i < intersects.length; i++) {
		intersects[i].object.material.color.set(0xff0000);
	}
	
	player.move();
	*/
	
	// Render the scene.
	renderer.render(scene, camera);
}

//window.addEventListener("mousemove", onMouseMove, false);