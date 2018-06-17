<template>
  <div class="bubble">
    <my-header activeIndex="/bubble"></my-header>
    <div id="game"></div>
    <div id="btn-set">
      <el-button type="primary" v-on:click="restart()">ReStart</el-button>
    </div>
  </div>
</template>

<script>

  import MyHeader from './MyHeader'
  import * as PIXI from 'pixi.js'
  import * as p2 from 'p2'
  import * as Phaser from 'phaser'
  import ElButton from "element-ui/packages/button/src/button";


  export default {
    components: {
      ElButton,
      MyHeader,
    },
    name: 'Bubble',
    data() {
      return {
        gameState: {},
        app: {},
        targetGraphics: {},
        game: {},
        bubbles: [],
        bubbleNum: 0,
        windowWidth: 0,
        windowHeight: 0,
        gameOverBlock: {},
        gameOverText: {},
        graphics: {},
        timer: {},
        gameScene: {},
        targetTime: 5,
        targetColor: 0,
        targetRect: {},
        timedEvent: {},
        myBubble: {
          radius: 0,
          color: 0xffffff,
          pointerCircle: {},
          instance: {}
        },
      }
    },

    beforeDestroy() {
      let canvas = document.getElementsByTagName('canvas')[0];
      document.body.removeChild(canvas)
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    mounted() {
      let self = this;
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight - 60;


      self.gameScene = new Phaser.Class({
        key: 'gameStart',
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
      });

      let gameConfig = {
        scene: [self.gameScene],
        type: Phaser.AUTO,
        transparent: false,
        backgroundColor: 0xdddddd,
        width: 800,
        height: 600,

        physics: {
          default: 'impact',
          impact: {
            debug: false,
            maxVelocity: 500
          }
        },
      };

      gameConfig.width = self.windowWidth;
      gameConfig.height = self.windowHeight;
      self.game = new Phaser.Game(gameConfig);
      document.getElementById('btn-set').style.display = 'none';

    },


    methods: {

      restart: function () {
        let self = this;
        document.getElementById('btn-set').style.display = 'none';
        this.gameOverBlock.setVisible(false);
        this.gameOverText.setText('');


        this.gameScene.scene.restart();
      },

      endGame: function () {
        this.gameOverBlock.setVisible(true);
        this.gameOverText.setText('Game Over');

        if (document.getElementById('btn-set')) {
          document.getElementById('btn-set').style.display = 'inline-block';
        }

      },


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
        canvas.width = this.windowWidth;
        canvas.height = this.windowHeight - 60;
      },


      createMyBubble: function () {
        let self = this;
        self.graphics = this.gameScene.add.graphics();

        let radius = 20;
        let x = 400;
        let y = 300;
        this.myBubble.pointerCircle = new Phaser.Geom.Circle(x, y, radius);

        this.myBubble.instance = this.gameScene.impact.add.body(x - radius, y - radius).setBounce(1);
        this.myBubble.instance.setBodySize(radius * 2, radius * 2);


        this.myBubble.instance.body.updateCallback = function (body) {
          self.drawCircle();
          self.gameScene.input.on('pointermove', function (pointer) {
            body.pos.x = pointer.x - radius;
            body.pos.y = pointer.y - radius;
            self.myBubble.pointerCircle.x = pointer.x;
            self.myBubble.pointerCircle.y = pointer.y;
          });


        };
      },

      drawCircle: function () {
        this.graphics.clear();
        this.graphics.lineStyle(4, this.myBubble.color);
        this.graphics.strokeCircleShape(this.myBubble.pointerCircle);

      },

      create: function (vue) {
        let self = this;

        this.gameScene = vue;

        //  Calling this with no arguments will set the bounds to match the game gameConfig width/height

        vue.impact.world.setBounds();

        this.createOtherBubble(20);

        this.createMyBubble();

        this.createTimer();

        let rec = new Phaser.Geom.Rectangle(0, 0, this.windowWidth, this.windowHeight);
        this.gameOverBlock = this.gameScene.add.graphics({fillStyle: {color: 0xdddddd, alpha: 0.7}});
        this.gameOverBlock.fillRectShape(rec);
        this.gameOverBlock.setVisible(false);

        this.gameOverText = this.gameScene.add.text(this.windowWidth / 2 - 140, this.windowHeight / 2 - 100, '', {fontSize: '54px'});


      },


      createTimer: function () {
        this.targetColor = this.randomColor();
        this.targetRect = new Phaser.Geom.Rectangle(230, 40, 20, 20);

        this.targetGraphics = this.gameScene.add.graphics({fillStyle: {color: this.targetColor}});
        this.targetGraphics.fillRectShape(this.targetRect);

        this.targetRect.diameter = this.targetRect.radius;
        this.timer = this.gameScene.add.text(60, 30, 'Target:', {fontSize: '36px', fontColor: '#ffffff'});


        this.timedEvent = this.gameScene.time.addEvent({
          delay: 1000,
          callback: this.checkBubbleColor,
          callbackScope: this.gameScene,
          repeat: this.targetTime
        });

      },

      checkBubbleColor: function () {
        if(!this.timer)
          return
        if (this.timer.text.split('   ')[1] === '0') {
          if (this.myBubble.color === this.targetColor) {
            this.targetColor = this.randomColor();
            this.targetRect = new Phaser.Geom.Rectangle(230, 40, 20, 20);

            this.targetGraphics = this.gameScene.add.graphics({fillStyle: {color: this.targetColor}});
            this.targetGraphics.fillRectShape(this.targetRect);

            this.targetRect.diameter = this.targetRect.radius;

            this.timedEvent = this.gameScene.time.addEvent({
              delay: 1000,
              callback: this.checkBubbleColor,
              callbackScope: this.gameScene,
              repeat: this.targetTime
            });

          }
          else {
            this.endGame();

          }
        }
      },


      createOtherBubble: function (num) {

        let self = this;
        let colorLock = [];

        for (let i = 0; i < num; i++) {

          colorLock.push(false);

          let vx = self.randomInt(80, 200);
          let vy = self.randomInt(80, 200);
          let radius = self.randomSize();

          let x = self.randomInt(radius + 20, self.windowWidth - radius - 20);
          let y = self.randomInt(radius + 20, self.windowHeight - radius - 20);
          let color;
          switch (num) {
            case 0:
              color = 0xF56C6C;
              break;
            case 1:
              color = 0xf9fc4e;
              break;
            case 2:
              color = 0x409EFF;
              break;

            default:
              color = self.randomColor();
              break;
          }

          let graphics = self.gameScene.add.graphics();

          //  Create a Graphics object
          let bubble = this.gameScene.impact.add.body(x, y).setActiveCollision().setVelocity(vx, vy).setBounce(1);
          bubble.setBodySize(radius * 2, radius * 2);
          bubble.body.id = i;
          bubble.body.updateCallback = function (body) {

            graphics.clear();

            graphics.fillStyle(color, 0.6);
            let circle = new Phaser.Geom.Circle(body.pos.x + radius, body.pos.y + radius, radius);
            graphics.fillCircleShape(circle);

            self.graphics.clear();
            self.graphics = self.gameScene.add.graphics();

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
      },

      update: function (vue) {
        if (this.timer)
          this.timer.setText('Target:   ' + this.timedEvent.repeatCount);
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

  #btn-set {
    display: inline-block;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    width: 100%;
    top: 420px;
  }
</style>
