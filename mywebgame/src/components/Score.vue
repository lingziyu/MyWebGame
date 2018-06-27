<template>
  <div class="score" style="text-align: center;overflow: auto">
    <my-header activeIndex="/score"></my-header>
    <h1 style="text-align: center">Score</h1>
      <el-table
        :data="tableData1"
        stripe
        style="background-color: #eeeeee;margin-top:100px;position: fixed;left: 100px;top: 100px;">
        <el-table-column
          prop="score1"
          label="Test游戏分数"
          width="180">
        </el-table-column>

      </el-table>

      <el-table
        :data="tableData2"
        stripe
        style="background-color: #eeeeee;margin-top:100px;position: fixed;left: 500px;top: 100px;">
        <el-table-column
          prop="score2"
          label="Bubble游戏分数"
          width="180">
        </el-table-column>

      </el-table>

      <el-table
        :data="tableData3"
        stripe
        style="background-color: #eeeeee;margin-top:100px;position: fixed;left: 900px;top: 100px;">
        <el-table-column
          prop="score3"
          label="Cube游戏分数"
          width="180">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import * as PIXI from 'pixi.js'
  import MyHeader from './MyHeader'
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    components: {
      ElButton,
      MyHeader
    },
    name: 'Score',
    mounted: function () {

      var test = JSON.parse(localStorage.test);
      var bubble = JSON.parse(localStorage.bubble);
      var cube = JSON.parse(localStorage.cube);
      this.tableData1 = [];
      for (var i = 0; i < test.length; i++) {
        this.tableData1.push({
          score1: test[i],
        })
      }
      for (var j = 0; j < bubble.length; j++) {
        this.tableData2.push({
          score2: bubble[j],
        })
      }
      for (var k = 0; k < cube.length; k++) {
        this.tableData3.push({
          score3: cube[k],
        })
      }
    },
    data() {
      return {
        tableData1: [],
        tableData2:[],
        tableData3:[]
      }
    }
  }
</script>


<style scoped>

</style>
