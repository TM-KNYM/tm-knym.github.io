(function() {
	var STEP = 4;
	var scene;
	var camera;
	var renderer;
	var container;
	var effect;
	var element;
	var controls;
	var clock;
	var edgesPool;

	function init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 9000);
		camera.position.set(0, -100, 0);
		camera.up.set(0, 1, 0);
		scene.add(camera);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setClearColor(0x0);
		renderer.setSize(window.innerWidth, window.innerHeight);

		if(window.devicePixelRatio) {
			renderer.setPixelRatio(window.devicePixelRatio);
		}

		element = renderer.domElement;

		container = document.getElementById("container");
		container.appendChild(element);

		effect = new THREE.StereoEffect(renderer);

		controls = new THREE.OrbitControls(camera, element);
		controls.rotateUp(Math.PI / 4);
		controls.target.set(
			camera.position.x + 0.15,
			camera.position.y,
			camera.position.z
		);
		controls.noZoom = true;
		controls.noPan = true;

		clock = new THREE.Clock();

		window.addEventListener("deviceorientation", setOrientationControls, true);

		window.addEventListener("resize", resize, false);
		resize();

		createBox();

		loop();
	}

	/**
	 * ジャイロセンサーでの操作へ変更します。
	 */
	function setOrientationControls(e) {
		if (!e.alpha) {
			return;
		}

		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();

		element.addEventListener("click", fullscreen, false);

		window.removeEventListener("deviceorientation", setOrientationControls, true);
	}

	/**
	 * 立方体の生成します。
	 */
	function createBox() {
		edgesPool = [];
		var geometry = new THREE.SphereGeometry(STEP);
		for(var i = 0; i < 1000; i++) {
            var cr = Math.round(0xFFFFFF * (Math.random()-0.5));
            var material = new THREE.MeshBasicMaterial({ color: cr });
			var egh = new THREE.Mesh(geometry, material);
			//var egh = new THREE.EdgesHelper(mesh, color);
			egh.updateMatrix();
			scene.add(egh);
			edgesPool.push(egh);
			startDrop(egh);
		}
	}

	/**
	 * 落下アニメーションを停止します。
	 */
	function startDrop(egh) {
		egh.position.x = 0; // Math.round(9000 * (Math.random() - 0.5) / STEP);
		egh.position.z = 0; // Math.round(9000 * (Math.random() - 0.5) / STEP) ;
		egh.position.y = -20000;//STEP * Math.round(9000 * (Math.random() - 0.5) / STEP) ;
		egh.updateMatrix();

		// 秒数
		var sec = 2 * Math.random() + 3;
		TweenMax.to(egh.position, sec, {
			x: Math.round(9000 * (Math.random() - 0.5) / STEP),
			z: Math.round(9000 * (Math.random() - 0.5) / STEP),
			y: 0,
			ease: Expo.easeOut,
			onComplete: endDrop,
			onCompleteParams: [egh]
		});
	}

	function endDrop(egh) {
		// 再度アニメーション
        var ratio = Math.floor( Math.random() * 11 );
		setTimeout(function() {
			startDrop(egh)
		}, ratio*100);
	}


    /**
	 * windowがリサイズしました。
	 */
	function resize() {
		var width = container.offsetWidth;
		var height = container.offsetHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
		effect.setSize(width, height);
	}

	/**
	 * 繰り返し実行される処理です。
	 */
	function loop() {
		requestAnimationFrame(loop);

		update(clock.getDelta());
		render();
	}

	/**
	 * 更新します。
	 */
	function update(dt) {
		if(edgesPool) {
			for (var i = 0; i < edgesPool.length; i++) {
				edgesPool[i].updateMatrix();
			}
		}

		camera.updateProjectionMatrix();

		controls.update(dt);
	}

	/**
	 * レンダリングします。
	 */
	function render() {
		effect.render(scene, camera);
        //renderer.render(scene, camera);
	}

	/**
	 * フルスクリーン表示へ切り替えます。
	 */
	function fullscreen() {
		if (container.requestFullscreen) {
			container.requestFullscreen();
		} else if (container.msRequestFullscreen) {
			container.msRequestFullscreen();
		} else if (container.mozRequestFullScreen) {
			container.mozRequestFullScreen();
		} else if (container.webkitRequestFullscreen) {
			container.webkitRequestFullscreen();
		}
	}

	window.addEventListener("DOMContentLoaded", init, false);
})();
