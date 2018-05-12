<template>
  <div class="hello">
    <my-header activeIndex="/"></my-header>
    <game-card></game-card>

  </div>
</template>

<script>
  import GameCard from './GameCard'
  import MyHeader from './MyHeader'
export default {
  components: {
    MyHeader,
    GameCard},
  name: 'HelloWorld',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h1{
    font-size: 40pt;
    text-align: center;
    color: #409EFF;
  }


</style>
