<template>
  <div class="cube">
    <my-header activeIndex="/cube"></my-header>

    <div id="blocker">
      <div id="instructions">
        <span style="font-size:40px">点击屏幕开始</span>
        <br />
        <br />
        (W, A, S, D = 移动, SPACE = 跳跃, MOUSE = 移动视角)
      </div>
    </div>

    <div id="my-scene"></div>
    <div id="btn-set">
      <el-button type="primary">Test Again</el-button>
    </div>
  </div>
</template>

<script>
  import MyHeader from './MyHeader'
  import ElButton from "element-ui/packages/button/src/button";
  import * as THREE from 'three';


  export default {
    components: {
      ElButton,
      MyHeader
    },
    name: 'Cube',
    data() {
      return {
        camera: {},
        scene: {},
        renderer: {},
        geometry: {},
        material: {},
        mesh: {},
        height:300,
        width:400,
        controls:{},
      }
    },

    mounted(){

      let PointerLockControls = function ( camera ) {

        let scope = this;

        camera.rotation.set( 0, 0, 0 );

        let pitchObject = new THREE.Object3D();
        pitchObject.add( camera );

        let yawObject = new THREE.Object3D();
        yawObject.position.y = 10;
        yawObject.add( pitchObject );

        let PI_2 = Math.PI / 2;

        let onMouseMove = function ( event ) {

          if ( scope.enabled === false ) return;

          let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
          let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

          yawObject.rotation.y -= movementX * 0.002;
          pitchObject.rotation.x -= movementY * 0.002;

          pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

        };

        this.dispose = function () {

          document.removeEventListener( 'mousemove', onMouseMove, false );

        };

        document.addEventListener( 'mousemove', onMouseMove, false );

        this.enabled = false;

        this.getObject = function () {

          return yawObject;

        };

        this.getDirection = function () {

          // assumes the camera itself is not rotated

          let direction = new THREE.Vector3( 0, 0, - 1 );
          let rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

          return function ( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v.copy( direction ).applyEuler( rotation );

            return v;

          };

        }();

      };

      let camera, scene, renderer, controls;

      let objects = [];

      let raycaster;

      let blocker = document.getElementById( 'blocker' );
      let instructions = document.getElementById( 'instructions' );


      let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

      if ( havePointerLock ) {

        let element = document.body;

        let pointerlockchange = function ( event ) {

          if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

          } else {

            controls.enabled = false;

            blocker.style.display = 'block';

            instructions.style.display = '';

          }

        };

        let pointerlockerror = function ( event ) {

          instructions.style.display = '';

        };

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {

          instructions.style.display = 'none';

          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
          element.requestPointerLock();

        }, false );

      } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

      }

      let controlsEnabled = false;

      let moveForward = false;
      let moveBackward = false;
      let moveLeft = false;
      let moveRight = false;
      let canJump = false;

      let prevTime = performance.now();
      let velocity = new THREE.Vector3();
      let direction = new THREE.Vector3();
      let vertex = new THREE.Vector3();
      let color = new THREE.Color();

      init();
      animate();

      function init() {

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

        let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        controls = new PointerLockControls( camera );
        scene.add( controls.getObject() );

        let onKeyDown = function ( event ) {

          switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
              moveForward = true;
              break;

            case 37: // left
            case 65: // a
              moveLeft = true; break;

            case 40: // down
            case 83: // s
              moveBackward = true;
              break;

            case 39: // right
            case 68: // d
              moveRight = true;
              break;

            case 32: // space
              if ( canJump === true ) velocity.y += 350;
              canJump = false;
              break;

          }

        };

        let onKeyUp = function ( event ) {

          switch( event.keyCode ) {

            case 38: // up
            case 87: // w
              moveForward = false;
              break;

            case 37: // left
            case 65: // a
              moveLeft = false;
              break;

            case 40: // down
            case 83: // s
              moveBackward = false;
              break;

            case 39: // right
            case 68: // d
              moveRight = false;
              break;

          }

        };

        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        // floor

        let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
        floorGeometry.rotateX( - Math.PI / 2 );

        // vertex displacement

        let position = floorGeometry.attributes.position;

        for ( let i = 0; i < position.count; i ++ ) {

          vertex.fromBufferAttribute( position, i );

          vertex.x += Math.random() * 20 - 10;
          vertex.y += Math.random() * 2;
          vertex.z += Math.random() * 20 - 10;

          position.setXYZ( i, vertex.x, vertex.y, vertex.z );

        }

        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

        let count = floorGeometry.attributes.position.count;
        let colors = [];

        for ( let i = 0; i < count; i ++ ) {

          color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
          colors.push( color.r, color.g, color.b );

        }

        floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        let floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

        let floor = new THREE.Mesh( floorGeometry, floorMaterial );
        scene.add( floor );

        // objects

        let boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices

        count = boxGeometry.attributes.position.count;
        colors = [];

        for ( let i = 0; i < count; i ++ ) {

          color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
          colors.push( color.r, color.g, color.b );

        }

        boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        for ( let i = 0; i < 500; i ++ ) {

          let boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
          boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

          let box = new THREE.Mesh( boxGeometry, boxMaterial );
          box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
          box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
          box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

          scene.add( box );
          objects.push( box );

        }

        //

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      function animate() {

        requestAnimationFrame(animate);

        if (controlsEnabled === true) {

          raycaster.ray.origin.copy(controls.getObject().position);
          raycaster.ray.origin.y -= 10;

          let intersections = raycaster.intersectObjects(objects);

          let onObject = intersections.length > 0;

          let time = performance.now();
          let delta = (time - prevTime) / 1000;

          velocity.x -= velocity.x * 10.0 * delta;
          velocity.z -= velocity.z * 10.0 * delta;

          velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

          direction.z = Number(moveForward) - Number(moveBackward);
          direction.x = Number(moveLeft) - Number(moveRight);
          direction.normalize(); // this ensures consistent movements in all directions

          if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
          if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

          if (onObject === true) {

            velocity.y = Math.max(0, velocity.y);
            canJump = true;

          }

          controls.getObject().translateX(velocity.x * delta);
          controls.getObject().translateY(velocity.y * delta);
          controls.getObject().translateZ(velocity.z * delta);

          if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

          }

          prevTime = time;

        }

        renderer.render(scene, camera);
      }
    },
    methods: {
      init: function () {
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initMyBubble(0.1, 0.2, 0, this.randomColor());
        this.initOtherBubble(-0.1, -0.3, 0, 0.2, this.randomColor());
        this.initRender();

        let PointerLockControls = require('three-pointerlock');
        this.controls = new PointerLockControls(this.camera);

      },


      initRender: function () {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor('#dddddd', 1.0);
        document.getElementById('my-scene').appendChild(this.renderer.domElement);
      },
      randomSize: function () {
        let index = this.randomInt(0, 4);
        switch (index) {
          case 0:
            return 20;
          case 1:
            return 30;
          case 2:
            return 40;
          case 3:
            return 50;
          case 4:
            return 60;

        }
      },


      randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },


      randomColor: function () {
        let index = this.randomInt(0, 6);
        switch (index) {
          case 0:
            return 0xffffff;
          case 1://红色
            return 0xF56C6C;
          case 2://黄色
            return 0xf9fc4e;
          case 3://蓝色
            return 0x409EFF;
          case 4://橙色
            return 0xE6A23C;
          case 5://紫色
            return 0x7e62d5;
          case 6://绿色
            return 0x67C23A;
        }
      },

      randomColorPair: function (color) {
        switch (color) {
          case 0xffffff:
            return 0xcccccc;
          case 0xF56C6C://红色
            return 0xe03e3e;
          case 0xf9fc4e://黄色
            return 0xe2e534;
          case 0x409EFF://蓝色
            return 0x1774d1;
          case 0xE6A23C://橙色
            return 0xdb9129;
          case 0x7e62d5://紫色
            return 0x6648c9;
          case 0x67C23A://绿色
            return 0x4ba51d;
        }
      },


      initMyBubble: function (x, y, z, color) {
        this.geometry = new THREE.TorusGeometry(0.1, 0.03, 16, 100);
        this.material = new THREE.MeshLambertMaterial({color: color, emissive: this.randomColorPair(color)});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
        this.mesh.position.set(x, y, z);

      },

      initLight: function () {
        let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);
      },
      initScene: function () {
        this.scene = new THREE.Scene();
      },

      initOtherBubble: function (x, y, z, size, color) {

        let geometry = new THREE.BoxGeometry(size, size, size);
        let material = new THREE.MeshLambertMaterial({color: color, emissive: this.randomColorPair(color)});
        let box = new THREE.Mesh(geometry, material);
        this.scene.add(box);
        this.mesh.position.set(x, y, z);
      },

      initCamera: function () {
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
        this.camera.position.set(0, 0, 2);
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.lookAt (new THREE.Vector3 (0.0, 0.0, 0.0));
      },

      animate: function () {

        this.mesh.rotation.x += 0.01;
        this.controls.update(1);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);

      },



    }
  }
</script>


<style scoped>
  #btn-set {
    display: none;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    top: 420px;
  }

  #blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }

  #instructions {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -moz-box;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    box-orient: horizontal;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
  }


</style>
