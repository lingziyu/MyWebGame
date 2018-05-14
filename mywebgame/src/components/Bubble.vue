<template>
  <div class="bubble">
    <my-header activeIndex="/bubble"></my-header>
    <div id="game"></div>
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
        gameState: {},
        app: {},
        game: {},
        bubbles: [],
        bubbleNum: 0,
        windowWidth:0,
        windowHeight:0,
        graphics:{},
        colorLock:[],
        myBubble:{
          radius:0,
          color:0xffffff,
          pointerCircle:{},
        },
      }
    },

    mounted() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight - 60;

      let self = this;

      let config = {
        type: Phaser.AUTO,
          transparent:false,
          backgroundColor:0xdddddd,
          width: 800,
          height: 600,

          physics: {
        default: 'arcade',
            arcade: {
            gravity: {y: 200}
          }
        },
        scene: {
          preload: function () {
            let scene = this;
            self.preload(scene)
          },
          create: function () {
            let scene = this;
            self.create(scene)
          },

          update:function () {
            let scene = this;
            self.update(scene)
          }
        }
      };

      config.width = window.innerWidth;
      config.height = window.innerHeight - 60;

      this.game = new Phaser.Game(config);

    },


    methods: {


      colorIndex:function (color) {
          switch (color) {
            case 0xffffff:
              return 0;
            case 0xF56C6C://红色
              return 1;
            case 0xf9fc4e://黄色
              return 2;
            case 0x409EFF://蓝色
              return 3;
            case 0xE6A23C://橙色
              return 4;
            case 0x7e62d5://紫色
              return 5;
            case 0x67C23A://绿色
              return 6;
          }
      },

      colorAfterHit:function (hitColor) {
        let myColorIndex = this.colorIndex(this.myBubble.color);
        let hitColorIndex = this.colorIndex(hitColor);
        let colorTable = [
          [0xffffff,0xF56C6C,0xf9fc4e,0x409EFF,0xE6A23C,0x7e62d5,0x67C23A],
          [0xF56C6C,0xF56C6C,0xE6A23C,0x7e62d5,0xE6A23C,0x7e62d5,0xffffff],
          [0xf9fc4e,0xE6A23C,0xf9fc4e,0x67C23A,0xE6A23C,0xffffff,0x67C23A],
          [0x409EFF,0x7e62d5,0x67C23A,0x409EFF,0xffffff,0x7e62d5,0x67C23A],
          [0xE6A23C,0xE6A23C,0xE6A23C,0xffffff,0xE6A23C,0xffffff,0xffffff],
          [0x7e62d5,0x7e62d5,0xffffff,0x7e62d5,0xffffff,0x7e62d5,0xffffff],
          [0x67C23A,0xffffff,0x67C23A,0x67C23A,0xffffff,0xffffff,0x67C23A]];
        return colorTable[myColorIndex][hitColorIndex];
      },

      preload:function (vue) {
        // vue.load.image('logo', 'logo.png');
      },

      resizeCanvas: function () {
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 60;
      },


      createMyBubble:function (vue) {
        let self = this;

        this.myBubble.pointerCircle = new Phaser.Geom.Circle(400, 300, 20);

        vue.input.on('pointermove', function (pointer) {

          self.myBubble.pointerCircle.x = pointer.x;
          self.myBubble.pointerCircle.y = pointer.y;

        });
      },

      create: function (vue) {
        this.createMyBubble(vue);

        for (let i = 0; i < 13; i++) {
          this.createARandomBubble(vue);
          this.colorLock[i] = false;
        }


      },

      update:function () {

        this.graphics.clear();

        for(let i=0;i<this.bubbles.length;i++){
          if (Phaser.Geom.Intersects.CircleToCircle(this.bubbles[i].circle, this.myBubble.pointerCircle))
          {
            if(!this.colorLock[i]) {
              this.colorLock[i] = true;
              this.myBubble.color = this.colorAfterHit(this.bubbles[i].color);
              this.graphics.lineStyle(4, this.bubbles[i].color);
            }else {
              this.graphics.lineStyle(4, this.myBubble.color);
            }

          }else {
            this.colorLock[i] = false;

            this.graphics.lineStyle(4, this.myBubble.color);
          }
          this.graphics.strokeCircleShape(this.myBubble.pointerCircle);
        }

      },

      createARandomBubble(vue) {
        let size = this.randomSize();
        let x = this.randomInt(size + 20, this.windowWidth - size - 20);
        let y = this.randomInt(size + 20, this.windowHeight - size - 20);

        this.createABubble(x, y, size, this.randomColor(), vue);
      },

      randomColor: function () {
        let index = this.randomInt(0, 6);
        switch (index) {
          case 0:
            return 0xffffff;
          case 1://红色
            return 0xF56C6C;
          case 2://黄色
            return 0xf9fc4e;
          case 3://蓝色
            return 0x409EFF;
          case 4://橙色
            return 0xE6A23C;
          case 5://紫色
            return 0x7e62d5;
          case 6://绿色
            return 0x67C23A;
        }
      },

      randomSize: function () {
        let index = this.randomInt(0, 4);
        switch (index) {
          case 0:
            return 20;
          case 1:
            return 30;
          case 2:
            return 40;
          case 3:
            return 50;
          case 4:
            return 60;

        }
      },


      randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      createABubble( x, y, radius, color, vue) {

        let circle = new Phaser.Geom.Circle(x, y, radius);
        this.graphics = vue.add.graphics({ fillStyle: { color: color } });
        this.graphics.setAlpha(0.6);
        this.graphics.fillCircleShape(circle);


        this.bubbleNum++;
        this.bubbles.push({
          id: this.bubbleNum,
          color: color,
          radius: radius,
          circle: circle,
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
