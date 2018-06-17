<template>
  <div class="cube">
    <my-header activeIndex="/cube"></my-header>
    <div style="margin-top: 60px;position: absolute; left:0px; top:0px; zindex:10; width:100%">
      <ul>
        <!--<li><div id="dbtitle">Triple Three</div></li>-->
        <li id="btnstart" class="btn" onClick="location.reload()">重开一局</li>
        <li id="dbscorelb">分数:</li>
        <li id="dbscorev"></li>
      </ul>
      <div id="dblog"></div>
    </div>

  </div>
</template>

<script>
  import MyHeader from './MyHeader'
  import ElButton from "element-ui/packages/button/src/button";
  import * as THREE from 'three';

  require('../../static/css/base.css');
  require('../../static/js/libs/three.js/three.js');
  require('../../static/js/libs/three.js/Projector.js');
  require('../../static/js/libs/three.js/OrbitControls.js');
  import { create, gameloop } from '../../static/js/library.js';

  export default {
    components: {
      ElButton,
      MyHeader
    },
    name: 'Cube',
    beforeDestroy(){
      let canvas = document.getElementsByTagName('canvas')[0];
      document.body.removeChild(canvas)
    },
    mounted() {

      create();
      gameloop();
    },
    methods: {}
  }
</script>


<style scoped>

</style>
