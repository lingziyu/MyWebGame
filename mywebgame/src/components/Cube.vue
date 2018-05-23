<template>
  <div class="cube">
    <my-header activeIndex="/cube"></my-header>
    <div id="my-canvas"></div>
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

      }
    },

    mounted() {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.getElementById('my-canvas').appendChild( renderer.domElement );

      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );

      camera.position.z = 5;

      var render = function () {
        requestAnimationFrame( render );

        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;

        renderer.render(scene, camera);
      };

      render();
    },
    methods: {

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

  canvas {
    width: 100%; height: 100%
  }
</style>
