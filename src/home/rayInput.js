function init(camera) {
	// initiate Reticulum so it loads up 
	Reticulum.init(camera, {
		proximity: false,
		reticle: {
			visible: true,
			restPoint: 1000, //Defines the reticle's resting point when no object has been targeted
			color: 0xcc0000,
			innerRadius: 0.0001,
			outerRadius: 0.003,
			hover: {
				color: 0xcc0000,
				innerRadius: 0.02,
				outerRadius: 0.024,
				speed: 5,
				vibrate: 50 //Set to 0 or [] to disable
			}
		},
		fuse: {
			visible: true,
			duration: 2.5,
			color: 0x00fff6,
			innerRadius: 0.045,
			outerRadius: 0.06,
			vibrate: 0, //Set to 0 or [] to disable
			clickCancelFuse: false //If users clicks on targeted object fuse is canceled
		}
	});
}

function add(object, overCallback, outCallback){
// *******************************
	// --- Reticulum ---
	// have the object react when user looks at it
	// track the object
	Reticulum.add( object, {
		onGazeOver: function(){
			// do something when user targets object
			// this.material.emissive.setHex( 0xffcc00 );
			// this.material.color = new THREE.Color(0, 0, 0);
			overCallback()
		},
		onGazeOut: function(){
			// do something when user moves reticle off targeted object
			// this.material.emissive.setHex( 0xcc0000 );
			// this.material.color = new THREE.Color(1, 0, 0);
			outCallback()
		},
		onGazeLong: function(){
			// do something user targetes object for specific time
			// this.material.emissive.setHex( 0x0000cc );
			// this.material.color = new THREE.Color(0, 0, 0);
		},
		onGazeClick: function(){
			// have the object react when user clicks / taps on targeted object
			// this.material.emissive.setHex( 0x00cccc * Math.random() );
			// this.material.color = new THREE.Color(0, 0, 0);
		}
	});
}

function update() {
	Reticulum.update()
}

export default {init, update, add}
