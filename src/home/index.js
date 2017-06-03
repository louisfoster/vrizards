import './index.less'
import video from './video'
import rayInput from './rayInput'

let container = null
let	renderer = null
let	effect = null
let	controls = null
let	scene = null
let	camera = null
let	cube = null
let	VRMode = false

// Set up Three.js
initThreeJS()
// Set up VR rendering
initVREffect()
// Create the scene content
initScene()
// Set up VR camera controls
initVRControls()

// init ray input
initRayInput()

// Run the run loop
run()
// Bind Dom Events
bindEvents()

function initThreeJS() {
	container = document.getElementById('container')
	// Create the Three.js renderer and attach it to our canvas
	renderer = new THREE.WebGLRenderer( { antialias: true } )
	// Set the viewport size
	renderer.setSize(window.innerWidth, window.innerHeight)
	container.appendChild(renderer.domElement)

	window.addEventListener('resize', function(event) {
		renderer.setSize(window.innerWidth, window.innerHeight)
	}, false)
}

function initRayInput() {
	rayInput.init(camera)
}

function initVREffect() {
// Set up Cardboard renderer
	effect = new THREE.StereoEffect(renderer)
	effect.setSize(window.innerWidth, window.innerHeight)

	// StereoEffect's default separation is in cm, we're in M
	// Actual cardboard eye separation is 2.5in
	// Finally, separation is per-eye so divide by 2
	effect.separation = 2.5 * 0.0254 / 2
}

function initScene() {
	// Create a new Three.js scene
	scene = new THREE.Scene()
	// Add  a camera so we can view the scene
	// Note that this camera's FOV is ignored in favor of the
	// Oculus-supplied FOV for each used inside VREffect.
	// See VREffect.js h/t Michael Blix
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 4000 )

	scene.add(camera)

	scene.add(video.init())

    //
    var ambient = new THREE.AmbientLight( 0x444444 )
    scene.add( ambient )
    var directionalLight = new THREE.DirectionalLight( 0xffeedd )
    directionalLight.position.set( 0, 10, 10 ).normalize()
    scene.add( directionalLight )

    // let mtlLoader = new THREE.MTLLoader()
    // mtlLoader.setPath( 'src/home/obj/' )
    // mtlLoader.load( 'Excavator.mtl', function( materials ) {

        // materials.preload()

		let objLoader = new THREE.OBJLoader()

        // objLoader.setMaterials( materials )

		objLoader.setPath( 'src/home/obj/' )
        objLoader.load( 'tractor.obj', function ( object ) {

					// rayInput.add(object) 

            object.position.x = 0
            object.position.y = -6
         	object.position.z = 1

			object.scale.x = 12
            object.scale.y = 12
            object.scale.z = 12

            scene.add( object )

        })
    //
    // })

	// Create a texture-mapped cube and add it to the scene
	// First, create the texture map
	var mapUrl = 'src/home/images/webvr-logo-512.jpeg';

	var loader = new THREE.TextureLoader();

	loader.load(mapUrl, function(map){
		// Now, create a Basic material; pass in the map
		var material = new THREE.MeshBasicMaterial({ map: map });
		// Create the cube geometry
		var geometry = new THREE.BoxGeometry(2, 2, 2);
		// And put the geometry and material together into a mesh
		cube = new THREE.Mesh(geometry);
		// Move the mesh back from the camera and tilt it toward the viewer
		cube.position.z = -6;
		cube.rotation.x = Math.PI / 5;
		cube.rotation.y = Math.PI / 5;
		// Finally, add the mesh to our scene
		scene.add(cube);
		rayInput.add(cube) 
	});
				


}

function initVRControls() {
	// Set up VR camera controls
	controls = new THREE.DeviceOrientationControls(camera)
}

// let duration = 10000; // ms
// let currentTime = Date.now()

// function animate() {
// 	// if(!cube){
// 	// 	return
// 	// }
//
// 	let now = Date.now()
// 	let deltat = now - currentTime
// 	currentTime = now
// 	// let fract = deltat / duration
// 	// let angle = Math.PI * 2 * fract
// 	// cube.rotation.y += angle
// }

function run() {
	requestAnimationFrame(run)

	if(VRMode){
		// ------------- CardBoard Mode ------------------
		// Render the scene
		effect.render( scene, camera )
	}else{
		// ---------------- Normal Mode ------------------
		renderer.render( scene, camera )
	}

	// Update the VR camera controls
	controls.update()

	// Update the ray input
	rayInput.update()
	
	// Spin the cube for next frame
	// animate()
}

function bindEvents(){
	document.querySelector('#btn-vr').addEventListener('click', () => {
		VRMode = !VRMode

		if ( container.mozRequestFullScreen ) {
			container.mozRequestFullScreen()
		} else {
			container.webkitRequestFullscreen()
		}
	}, false)
}
