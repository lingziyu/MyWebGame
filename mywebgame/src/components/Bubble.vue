<template>
  <div class="bubble">
    <my-header activeIndex="/bubble"></my-header>

  </div>
</template>

<script>
  import MyHeader from './MyHeader'
  export default {
    components: {
      MyHeader,
    },
    name: 'Bubble',
    data () {
      return {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
