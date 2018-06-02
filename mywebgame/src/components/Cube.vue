<template>
  <div class="cube">
    <my-header activeIndex="/cube"></my-header>
    <div id="dashboard" style="position: absolute; left:0px; top:0px; zindex:10; width:100%">
      <ul>
        <!--<li><div id="dbtitle">Triple Three</div></li>-->
        <li id="btnstart" class="btn" onClick="location.reload()">New Game</li>
        <li id="btnhelp" class="btn" onClick="helpClick()">Help</li>
        <li id="btnsound" class="btn" onClick="switchSound()">Sound Off</li>
        <li>&nbsp;&nbsp;</li>
        <li id="dbscorelb">Score:</li>
        <li id="dbscorev"></li>
      </ul>
      <div id="dblog"></div>
      <div id="helptext" class="hidden">
        <p>The lower separate field holds the next stone.</p>
        <p>Click a free place in the board to make a move.</p>
        <p>Try to collect stones with same height and same color next to each other.</p>
        <p>3 stones with the same height will grow to the next level.</p>
        <p>Use the upper separate field as reserve.</p>
        <p><div id="btnhelpclose" class="btn" style="width:60px;" onClick="helpClick()">Close</div></p>
      </div>
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
  require('../../static/js/libs/Tween.js');
  import { init, animate } from '../../static/js/triple_three.js';

  export default {
    components: {
      ElButton,
      MyHeader
    },
    name: 'Cube',
    data() {
      return {
        scene: {},
        camera: {},
        renderer: {}
      }
    },

    mounted() {
      init();
      animate();
    },
    methods: {}
  }
</script>


<style scoped>

</style>
