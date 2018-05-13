<template>
  <div class="bubble">
    <my-header activeIndex="/bubble"></my-header>

  </div>
</template>

<script>

  import MyHeader from './MyHeader'
  import * as PIXI from 'pixi.js'
  import * as p2 from 'p2'
  import * as Phaser from 'phaser'


  export default {
    components: {
      MyHeader,
    },
    name: 'Bubble',
    data() {
      return {
        app: {},
        height: 600,
        width: 800,
        bubbles:[],
        bubbleNum:0
      }
    },

    mounted() {
      this.width = window.innerWidth;
      this.height = window.innerHeight - 60;

      window.addEventListener("resize", this.resizeCanvas, false);


      this.app = new PIXI.Application({
        width: 512,
        height: 512,
        antialias: true, //antialias使得字体的边界和几何图形更加圆滑
        transparent: false,
        resolution: 1 //resolution让Pixi在不同的分辨率和像素密度的平台上运行变得简单
      });

      this.$el.append(this.app.view);
      this.app.renderer.backgroundColor = 0xeeeeee;
      this.app.autoResize = true;
      this.app.renderer.resize(this.width, this.height);


      this.startGame();
    },


    methods: {

      resizeCanvas: function () {
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 60;
      },
      startGame: function () {
        for(let i = 0; i < 5; i++){
          this.createARandomBubble();
        }
      },

      createARandomBubble() {
        let size = this.randomSize();
        let x = this.randomInt(size / 2 + 10, this.width/2 - size - 10);
        let y = this.randomInt(size / 2 + 10, this.height/2 - size - 10);

        this.createABubble(x, y, size, this.randomColor());
      },

      randomColor: function () {
        let index = this.randomInt(0, 6);
        switch (index) {
          case 0:
            return 0xffffff;
          case 1:
            return 0x409EFF;
          case 2:
            return 0x67C23A;
          case 3:
            return 0xE6A23C;
          case 4:
            return 0xF56C6C;
          case 5:
            return 0xea7035;
          case 6:
            return 0x7e62d5;
        }
      },

      randomSize: function () {
        let index = this.randomInt(0, 4);
        switch (index) {
          case 0:
            return 20;
          case 1:
            return 40;
          case 2:
            return 60;
          case 3:
            return 80;
          case 4:
            return 100;

        }
      },


      randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      createABubble(x, y, radius, color) {
        let circle = new PIXI.Graphics();
        circle.beginFill(color);
        circle.drawCircle(x, y, radius);
        circle.endFill();
        circle.x = x;
        circle.y = y;
        this.app.stage.addChild(circle);



        this.bubbleNum++;
        this.bubbles.push({
          id: this.bubbleNum,
          color:color,
          radius:radius,
          instance:circle,
          activate:true,
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
