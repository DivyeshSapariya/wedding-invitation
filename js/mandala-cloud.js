/* Mandala Cloud — adapted for wedding hero (gold particles, no debug UI) */
((main) => {
  this.requestAnimationFrame = (() => {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) { window.setTimeout(callback, 1000 / 60); };
  })();

  main(this, document, THREE);
})((window, document, three) => {
  'use strict';

  const PI = Math.PI;
  const TAU = PI * 2;
  const COS = Math.cos;
  const SIN = Math.sin;

  const APP_DEFAULTS = {
    dimensions: { x: 0, y: 0 },
    camera: {
      fov: 70, aspectRatio: 0, nearPlane: 0.1, farPlane: 10000,
      distanceX: 50, distanceY: 700, distanceZ: -50,
      speedX: 0.8, speedY: 0.4, speedZ: 0.1
    },
    particles: {
      ySegments: 80, xSegments: 240, size: 1.2,
      color: '#d4af37',
      waveSizeX: 250, waveSizeY: 0, waveSizeZ: 250
    }
  };

  class App {
    constructor(container) {
      this.container = container;
      this.props = JSON.parse(JSON.stringify(APP_DEFAULTS));
      this.initCamera();
      this.initScene();
      this.initLights();
      this.setSize();
      window.addEventListener('resize', () => this.setSize());
    }

    setSize() {
      const rect = this.container.getBoundingClientRect();
      this.props.dimensions.x = rect.width || window.innerWidth;
      this.props.dimensions.y = rect.height || window.innerHeight;
      this.renderer.setSize(this.props.dimensions.x, this.props.dimensions.y);
      this.camera.aspect = this.props.camera.aspectRatio =
        this.props.dimensions.x / this.props.dimensions.y;
      this.camera.updateProjectionMatrix();
    }

    initCamera() {
      this.camera = new three.PerspectiveCamera(
        this.props.camera.fov,
        this.props.camera.aspectRatio,
        this.props.camera.nearPlane,
        this.props.camera.farPlane
      );
    }

    initScene() {
      this.scene = new three.Scene();
      this.scene.add(this.camera);
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.appendChild(this.renderer.domElement);
    }

    initLights() {
      this.mainLight = new three.HemisphereLight(0x000000, 0xffffff, 0.95);
      this.mainLight.position.set(0, -500, 0);
      this.scene.add(this.mainLight);
      this.ambientLight = new three.AmbientLight(0xffd88a, 0.6);
      this.ambientLight.position.set(-200, -100, 0);
      this.scene.add(this.ambientLight);
    }

    render() {
      this.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(this.render.bind(this));
    }

    update() {}
  }

  class MandalaCloud extends App {
    constructor(container) {
      super(container);
      this.tick = 0;
      this.build();
      this.render();
    }

    build() {
      const mat = new three.PointsMaterial({
        color: new three.Color(this.props.particles.color),
        transparent: true,
        opacity: 0.85,
        depthTest: true,
        size: this.props.particles.size
      });

      this.geometry = new three.SphereGeometry(
        400,
        this.props.particles.ySegments,
        this.props.particles.xSegments,
        0, TAU, 0, TAU
      );

      this.pointCloud = new three.Points(this.geometry, mat);
      this.scene.add(this.pointCloud);
      this.camera.position.set(0, -600, 600);
    }

    update() {
      this.tick++;
      const delta = this.tick * 0.005;
      this.geometry.verticesNeedUpdate = true;

      for (let i = 0; i < this.geometry.vertices.length; i++) {
        const point = this.geometry.vertices[i];
        const dX = SIN(delta + i) * (this.props.particles.waveSizeX * 0.004);
        const dY = COS(delta + i) * SIN(delta + i) * (this.props.particles.waveSizeY * 0.004);
        const dZ = COS(delta + i) * (this.props.particles.waveSizeZ * 0.004);
        point.add(new three.Vector3(dX, dY, dZ));
      }

      this.camera.lookAt(this.pointCloud.position);
      this.camera.position.x = this.props.camera.distanceX * COS(delta * this.props.camera.speedX);
      this.camera.position.y = this.props.camera.distanceY * COS(delta * this.props.camera.speedY);
      this.camera.position.z = this.props.camera.distanceZ * COS(delta * this.props.camera.speedZ);
    }
  }

  window.initMandalaCloud = function (containerId) {
    const container = document.getElementById(containerId);
    if (container && window.THREE) new MandalaCloud(container);
  };
});
