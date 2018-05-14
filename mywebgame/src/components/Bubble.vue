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
        windowWidth: 0,
        windowHeight: 0,
        graphics: {},
        myBubble: {
          radius: 0,
          color: 0xffffff,
          pointerCircle: {},
        },
      }
    },

    mounted() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight - 60;

      let self = this;

      let config = {
        type: Phaser.AUTO,
        transparent: false,
        backgroundColor: 0xdddddd,
        width: 800,
        height: 600,

        physics: {
          default: 'impact',
          impact: {
            debug: true,
            maxVelocity: 500
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

          update: function () {
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


      colorIndex: function (color) {
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

      colorAfterHit: function (hitColor) {
        let myColorIndex = this.colorIndex(this.myBubble.color);
        let hitColorIndex = this.colorIndex(hitColor);
        let colorTable = [
          [0xffffff, 0xF56C6C, 0xf9fc4e, 0x409EFF, 0xE6A23C, 0x7e62d5, 0x67C23A],
          [0xF56C6C, 0xF56C6C, 0xE6A23C, 0x7e62d5, 0xE6A23C, 0x7e62d5, 0xffffff],
          [0xf9fc4e, 0xE6A23C, 0xf9fc4e, 0x67C23A, 0xE6A23C, 0xffffff, 0x67C23A],
          [0x409EFF, 0x7e62d5, 0x67C23A, 0x409EFF, 0xffffff, 0x7e62d5, 0x67C23A],
          [0xE6A23C, 0xE6A23C, 0xE6A23C, 0xffffff, 0xE6A23C, 0xffffff, 0xffffff],
          [0x7e62d5, 0x7e62d5, 0xffffff, 0x7e62d5, 0xffffff, 0x7e62d5, 0xffffff],
          [0x67C23A, 0xffffff, 0x67C23A, 0x67C23A, 0xffffff, 0xffffff, 0x67C23A]];
        return colorTable[myColorIndex][hitColorIndex];
      },

      preload: function (vue) {
        // vue.load.image('logo', 'logo.png');
      },

      resizeCanvas: function () {
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 60;
      },


      createMyBubble: function (vue) {
        let self = this;
        self.graphics = vue.add.graphics();

        let radius = 20;
        let x = 400;
        let y = 300;
        this.myBubble.pointerCircle = new Phaser.Geom.Circle(x, y, radius);

        let myBubble = vue.impact.add.body(x - radius, y - radius).setBounce(1);
        myBubble.setBodySize(radius * 2, radius * 2);


        myBubble.body.updateCallback = function (body) {

          self.drawCircle(body.pos.x, body.pos.y, radius, self.myBubble.color);


          vue.input.on('pointermove', function (pointer) {
            body.pos.x = pointer.x - radius;
            body.pos.y = pointer.y - radius;
            self.myBubble.pointerCircle.x = pointer.x;
            self.myBubble.pointerCircle.y = pointer.y;

          });


        };
      },

      drawCircle: function (x, y, radius, color) {
        this.graphics.clear();
        this.graphics.lineStyle(4, this.myBubble.color);
        this.graphics.strokeCircleShape(this.myBubble.pointerCircle);

      },

      // drawBuble: function (graphics, x, y, radius, color) {
      //
      //   graphics.fillStyle(color, 0.6);
      //   let circle = new Phaser.Geom.Circle(x, y, radius);
      //   graphics.fillCircleShape(circle);
      //
      // },

      create: function (vue) {
        let self = this;

        //  Calling this with no arguments will set the bounds to match the game config width/height

        vue.impact.world.setBounds();

        vue.input.on('gameobjectdown', function (pointer) {

        });
        let colorLock = [];

        for (let i = 0; i < 10; i++) {

          colorLock.push(false);

          let vx = self.randomInt(50, 100);
          let vy = self.randomInt(50, 100);
          let radius = self.randomSize();

          let x = self.randomInt(radius + 20, self.windowWidth - radius - 20);
          let y = self.randomInt(radius + 20, self.windowHeight - radius - 20);
          let color = self.randomColor();


          //  Create a Graphics object
          let graphics = vue.add.graphics();
          let bubble = vue.impact.add.body(x, y).setActiveCollision().setVelocity(vx, vy).setBounce(1);
          bubble.setBodySize(radius * 2, radius * 2);
          bubble.body.id = i;
          bubble.body.updateCallback = function (body) {
            graphics.clear();

            graphics.fillStyle(color, 0.6);
            let circle = new Phaser.Geom.Circle(body.pos.x + radius, body.pos.y + radius, radius);
            graphics.fillCircleShape(circle);

            self.graphics.clear();
            self.graphics = vue.add.graphics();

            if (Phaser.Geom.Intersects.CircleToCircle(circle, self.myBubble.pointerCircle)) {
              if (!colorLock[body.id]) {
                colorLock[body.id] = true;
                self.myBubble.color = self.colorAfterHit(color);
                self.graphics.lineStyle(4, color);
              } else {
                self.graphics.lineStyle(4, self.myBubble.color);
              }
            }
            else {
              colorLock[body.id] = false;
              self.graphics.lineStyle(4, self.myBubble.color);
            }
            self.graphics.strokeCircleShape(self.myBubble.pointerCircle);


          };

        }


        this.createMyBubble(vue);

      },

      update: function (vue) {


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


    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
