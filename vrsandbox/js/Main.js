(function() {
	var STEP = 100;
	var scene;
	var camera;
	var renderer;
	var container;
	var effect;
	var element;
	var controls;
	var clock;
	var edgesPool;

	/**
	 * Initialize
	 */
	function init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 9000);
		camera.position.set(3000, 0, 0);
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
		var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
		for(var i = 0; i < 700; i++) {
            var color = Math.round(0xFFFFFF * (Math.random()-0.5));
			var mesh = new THREE.Mesh(geometry, material);
			var egh = new THREE.EdgesHelper(mesh, color);
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
		// ランダムに立方体を配置
		egh.position.y = STEP * Math.round(9000 * (Math.random() - 0.5) / STEP) ;
		egh.position.x = 20000;
		egh.position.z = STEP * Math.round(9000 * (Math.random() - 0.5) / STEP) ;
		egh.updateMatrix();

		// 秒数
		var sec = 8 * Math.random() + 3;

		TweenMax.to(egh.position, sec, {
			x: STEP / 2 + 8,
			ease: Expo.easeOut,
			onComplete: endDrop,
			onCompleteParams: [egh]
		});
	}

	/**
	 * 落下アニメーションが終了しました。
	 */
	function endDrop(egh) {
		// 再度アニメーション
		setTimeout(function() {
			startDrop(egh)
		}, 1000);
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
