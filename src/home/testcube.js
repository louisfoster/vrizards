function add(scene){
	// Create a texture-mapped cube and add it to the scene
	// First, create the texture map
	let mapUrl = require('./images/webvr-logo-512.jpeg')

	let loader = new THREE.TextureLoader()

	loader.load(mapUrl, function(map){
		// Now, create a Basic material; pass in the map
		let material = new THREE.MeshBasicMaterial({ map: map })
		// Create the cube geometry
		let geometry = new THREE.BoxGeometry(2, 2, 2)
		// And put the geometry and material together into a mesh
		let cube = new THREE.Mesh(geometry, material)
		// Move the mesh back from the camera and tilt it toward the viewer
		cube.position.z = -6
		cube.rotation.x = Math.PI / 5
		cube.rotation.y = Math.PI / 5
		// Finally, add the mesh to our scene
		scene.add(cube)
	})

}

export default {add}
