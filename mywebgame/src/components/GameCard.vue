<template>

  <div class="gameCard">
    <el-carousel  :height="height">
      <el-carousel-item v-for="item in items" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

  </div>
</template>

<script>
  export default {
    name: 'GameCard',
    mounted(){
      this.height = window.innerHeight - 60 + "px";
    },
    data () {
      return {
        height:"",
        items:[
          "A Colorful Set",
          "Test Game",
          "Bubble Game",
          "Cube Game"
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-carousel__item{
    text-align: center;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 40pt;
    opacity: 0.75;
    line-height: 600px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
