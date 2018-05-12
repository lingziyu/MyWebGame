<template>
  <div class="hello">
    <my-header activeIndex="/"></my-header>
    <game-card></game-card>
    <div class="btn-set">
      <el-button round type="primary" v-on:click="startGame()">Bubble Game</el-button>
      <el-button round v-on:click="testGame()">Test Game</el-button>
    </div>
  </div>
</template>

<script>
  import GameCard from './GameCard'
  import MyHeader from './MyHeader'
  import ElButton from "element-ui/packages/button/src/button";
export default {
  components: {
    ElButton,
    MyHeader,
    GameCard
  },
  name: 'HelloWorld',
  data () {
    return {

    }
  },
  methods:{
    startGame:function () {
      this.$router.push({name: 'Bubble'});
    },

    testGame:function () {
      this.$router.push({name: 'PIXI'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    text-align: center;
    height: 0;
  }

  .btn-set{
    position: relative;
    top: -200px;
    z-index: 100;
  }

  h1{
    font-size: 40pt;
    text-align: center;
    color: #409EFF;
  }


</style>
