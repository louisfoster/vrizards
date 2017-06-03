function init(camera, renderer) {
		// Here, camera is an instance of THREE.Camera,
	// If second HTMLElement arg is provided, it will be addEventListener'ed.
	let input = new RayInput(camera, renderer.domElement);

	// Register a callback whenever an object is acted on.
	input.on('raydown', (opt_mesh) => {
		// Called when an object was activated. If there is a selected object,
		// opt_mesh is that object.
	});

	// Register a callback when an object is selected.
	input.on('rayover', (mesh) => {
		// Called when an object was selected.
	});
}

function addObject(object){
	input.add(object)
}

export default {init, addObject}
