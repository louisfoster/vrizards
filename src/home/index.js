import './index.less'
import video from './video'
import rayInput from './rayInput'

let container = null
let	renderer = null
let	effect = null
let	controls = null
let	scene = null
let	camera = null
let	plane = null
let btn = null
let wheels = null
let tractorBody = null
let	VRMode = false
let wheelSpin = true
let sound = null

let isStart = false

let clock = new THREE.Clock()
let elapsedTimeSum = 0


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


    var listener = new THREE.AudioListener();
    camera.add( listener );
    var audioLoader = new THREE.AudioLoader();
    sound = new THREE.Audio( listener );
    audioLoader.load( 'src/home/videos/tractor.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop(true);
        sound.setVolume(0.02);
        sound.play();
    });

    var ambient = new THREE.AmbientLight( 0x222222 );
    scene.add( ambient );
    var directionalLight = new THREE.DirectionalLight( 0xbbbbbb );
    directionalLight.position.set( 0, 200, 50 ).normalize();
    scene.add( directionalLight );


	createTractor()

}

let defaultMaterial,  highlightMaterial

function createTractor() {

    let objLoader = new THREE.OBJLoader()

    objLoader.setPath( 'src/home/obj/' )
    objLoader.load( 'tractorbody.obj', function ( object ) {

        var material = new THREE.MeshPhongMaterial( { color: 0xdd2211 } );

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material = material;

            }

        } );

		tractorBody = object

		object.position.x = 0
		object.position.y = -6
		object.position.z = 1

		object.scale.x = 12
		object.scale.y = 12
		object.scale.z = 12

		scene.add( object )


	})

	objLoader.load( 'tracwheels.obj', function ( object ) {

		var material = new THREE.MeshLambertMaterial( { color: 0x333333 } );

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material = material;

			}

		} );

		object.position.x = 0
		object.position.y = -3.5
		object.position.z = -1.8

		object.scale.x = 12
		object.scale.y = 12
		object.scale.z = 12

		wheels = object

		scene.add( object )


	})

	let panelUrl = require('./images/panel.png')

	let loader = new THREE.TextureLoader()

	loader.load(panelUrl, function(map){
		// Now, create a Basic material; pass in the map
		let material = new THREE.MeshBasicMaterial({ map: map })
		// Create the cube geometry
		let geometry = new THREE.PlaneGeometry(2, 2, 2)
		// And put the geometry and material together into a mesh
		plane = new THREE.Mesh(geometry, material)
		// Move the mesh back from the camera and tilt it toward the viewer
		plane.position.z = -2
					plane.position.y = -1
		plane.rotation.x = Math.PI / -4
		// plane.rotation.y = Math.PI / 5
		// Finally, add the mesh to our scene
		scene.add(plane)
	})

	let lookUrl = require('./images/look.png')

	loader.load(lookUrl, function(map){
		// Now, create a Basic material; pass in the map
		let material = defaultMaterial = new THREE.MeshBasicMaterial({ map: map })
		// Create the cube geometry
		let geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5)
		// And put the geometry and material together into a mesh
		btn = new THREE.Mesh(geometry, material)

		rayInput.add(btn, () => {
			btn.material = highlightMaterial
		}, () => {
			btn.material = defaultMaterial
			video.play()
            sound.play()
			wheelStart()
		}, () => {
			video.stop()
            sound.pause()
			// sound
			wheelStahp()
		}) 

		// Move the mesh back from the camera and tilt it toward the viewer
		btn.position.z = -1.95
		btn.position.y = -0.85
		btn.rotation.x = Math.PI / -4
		// plane.rotation.y = Math.PI / 5
		// Finally, add the mesh to our scene
		scene.add(btn)
	})

	let higlightMapUrl = require('./images/look2.png')

	loader.load(higlightMapUrl, function (map) {
		// Now, create a Basic material; pass in the map
		highlightMaterial = new THREE.MeshBasicMaterial({map: map})
	})
}

function initVRControls() {
	// Set up VR camera controls
	controls = new THREE.DeviceOrientationControls(camera)
}

let duration = 10000; // ms
let currentTime = Date.now()

function animate() {
	if(!wheels || !wheelSpin){
		return
	}

	let now = Date.now()
	let deltat = now - currentTime
	currentTime = now
	let fract = deltat / duration
	let angle = Math.PI * 2 * fract
	wheels.rotation.x -= angle
}

function run() {
	elapsedTimeSum += clock.getElapsedTime()

	if(elapsedTimeSum > 2500){
		isStart = true
	}

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
	animate()

	if(!tractorBody){
		return
	}

	if(isStart){
		tractorBody.visible = true
		wheels.visible = true
		plane.visible = true
		btn.visible = true
	}else{
		tractorBody.visible = false
		wheels.visible = false
		plane.visible = false
		btn.visible = false
	}
}

function wheelStahp() {
	wheelSpin = false
}

function wheelStart() {
	wheelSpin = true
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
