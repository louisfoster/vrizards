let video

function init(scene){
	let geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
	geometry.scale( - 1, 1, 1 );

	video = document.createElement( 'video' );
	video.width = 640;
	video.height = 360;
	video.loop = false;
	video.muted = true;
	video.src = 'src/home/videos/tractor1.mp4';
	video.setAttribute( 'webkit-playsinline', 'true' );
	video.setAttribute( 'playsinline', 'true' );

	video.onended = function() {
		console.log("ended");
	}

	video.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); }, false);

	// hide the controls if they're visible
	if (video.hasAttribute('controls')) {
		video.removeAttribute('controls')   
	}

	video.play();

	let texture = new THREE.VideoTexture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;

	let material = new THREE.MeshBasicMaterial( { map : texture } );

	let mesh = new THREE.Mesh( geometry, material );

	mesh.rotation.y = Math.PI / 2

	return mesh
}

function play(){
	video.play()
}

function stop(){
	video.pause()
}

export default {init, play, stop}
