<template>
  <div class="myheader">
    <el-menu :router="isRouter"  :default-active="activeIndex" background-color='#191919' text-color="#A4A4A4" active-text-color='#ffffff' class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/"><i class="el-icon-star-off"></i>Color Bubble</el-menu-item>
      <el-menu-item index="/pixi">Color Test</el-menu-item>

    </el-menu>
    <div class="line"></div>

  </div>
</template>

<script>
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    name: 'MyHeader',
    props: ['activeIndex'],
    data() {
      return {
        isRouter: true,
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
  .el-menu-item:hover{
    background-color: #ddd;
  }

  .el-menu-item{
    font-size: 16pt;
    display: -webkit-flex;
    display: flex;
    display: inline-flex;
    display: -webkit-inline-flex;
    align-items: center;

  }
</style>
