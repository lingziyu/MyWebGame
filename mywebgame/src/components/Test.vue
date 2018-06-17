<template>
  <div class="Test">
    <my-header activeIndex="/test"></my-header>
    <div id="btn-set">
      <el-button type="primary" v-on:click="startTest()">Test Again</el-button>
    </div>
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
    name: 'Test',
    data() {
      return {
        winDifficult: 15,
        backgroundColor: 0xeeeeee,
        app: {},
        title: {},
        gameScene: {},
        gameOverScene: {},
        message: {},
        fontColor: 0x3f3f3f,
        difficult: 0,
        healthBar: {},
        windowHeight: 600,
        windowWidth: 800,
        error: 0,
        initDifficult: 112,
        score: {},
        finalScore: 0,
        myTicker:{}
      }
    },

    destroyed(){
      this.myTicker.stop()
    },

    mounted() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight - 60;
      this.app = new PIXI.Application({
        width: 512,
        height: 512,
        antialias: true, //antialias使得字体的边界和几何图形更加圆滑
        transparent: true,
        resolution: 1 //resolution让Pixi在不同的分辨率和像素密度的平台上运行变得简单
      });

      this.$el.append(this.app.view);
      this.app.autoResize = true;
      this.app.renderer.resize(this.windowWidth, this.windowHeight);

      this.gameScene = new PIXI.Container();
      this.app.stage.addChild(this.gameScene);
      this.gameOverScene = new PIXI.Container();
      this.app.stage.addChild(this.gameOverScene);
      const style = new PIXI.TextStyle({
        fontFamily: "Futura",
        fontSize: 36,
        fill: this.fontColor,
      });
      let tilte = new PIXI.Text("Click the Different Color", style);
      tilte.x = this.windowWidth / 2 - tilte.width / 2;
      tilte.y = 50;
      this.gameScene.addChild(tilte);


      this.message = new PIXI.Text("You Sensitivity", style);
      this.message.x = this.windowWidth / 2 - this.message.width / 2;
      this.message.y = this.windowHeight / 2 - 180;
      this.gameOverScene.addChild(this.message);

      const scoreStyle = new PIXI.TextStyle({
        fontFamily: "Futura",
        fontSize: 80,
        fill: 0xe4bb4e,
      });

      this.score = new PIXI.Text("End", scoreStyle);
      this.score.y = this.windowHeight / 2 - 100;

      this.gameOverScene.addChild(this.score);

      //Create the health bar
      this.healthBar = new PIXI.Container();
      this.healthBar.position.set(0, 0);
      this.gameScene.addChild(this.healthBar);

//Create the black background rectangle
      let innerBar = new PIXI.Graphics();
      innerBar.beginFill(0xEBEEF5);
      innerBar.drawRect(0, 0, this.windowWidth, 8);
      innerBar.endFill();
      this.healthBar.addChild(innerBar);

//Create the front red rectangle
      let outerBar = new PIXI.Graphics();
      outerBar.beginFill(0xF36D6E);
      outerBar.drawRoundedRect(0, 0, this.windowWidth, 8, 4);
      outerBar.endFill();
      this.healthBar.addChild(outerBar);

      this.healthBar.outer = outerBar;

      this.startTest();
      this.healthBar.outer.width = this.windowWidth;
      PIXI.state = this.play;
      // console.log(this.app.ticker)
      //  if(this.app.ticker.started)
      //      this.app.ticker.add(delta => this.gameLoop(delta));

       this.myTicker = new PIXI.ticker.Ticker().add((delta) => {
        this.gameLoop(delta)
      });
      this.myTicker.start()

    },
    methods: {


      startTest: function () {
        this.gameOverScene.visible = false;
        this.gameScene.visible = true;

        this.difficult = this.initDifficult;
        this.setAGame(this.initDifficult);
        this.healthBar.outer.width = this.windowWidth;
        document.getElementById('btn-set').style.display = 'none'
      },


      gameLoop: function (delta) {
        //Runs the current game `state` in a loop and renders the sprites
        PIXI.state(delta);
      },

      play: function (i,delta) {
        // console.log(i)
        this.healthBar.outer.width -= this.windowWidth / 2500;
        if (this.healthBar.outer.width <= 0) {
          this.end();
        }
      },

      setAGame: function () {
        let ranColor = this.randomColor();
        let resultColor = this.getResultColor(ranColor);
        let num = parseInt(180 / this.difficult);
        num = num > 6 ? 6 : num;
        num = num < 2 ? 2 : num;
        this.createAllColor(this.windowWidth / 2, 150, num, this.windowWidth / 3 / num, 5, ranColor, resultColor);

      },
      randomColor: function () {
        let color = "0x";
        for (let i = 0; i < 6; i++) {
          color += (Math.random() * 16 | 0).toString(16);
        }
        return color;
      },

      getResultColor: function getResultColor(ranColor) {
        let array = this.hex2RgbArray(ranColor);
        let newArray = new Array(3);
        const weightArray = [2 / 9, 4 / 9, 3 / 9];
        for (let i = 0; i < array.length; i++) {
          newArray[i] = array[i] + parseInt(this.difficult * weightArray[i]);
          if (!this.checkColor(newArray[i])) {
            newArray[i] = array[i] - parseInt(this.difficult * weightArray[i]);
          }
        }
        return this.rgbArray2Hex(newArray);
      },


      createAllColor: function (posx, posy, n, size, margin, color1, color2) {
        let self = this;

        let randomx = self.randomInt(0, n - 1);
        let randomy = self.randomInt(0, n - 1);

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(this.backgroundColor);
        rectangle.drawRoundedRect(posx - n * size / 2, posy, n * size + 5 * margin, n * size + 5 * margin, 0);
        rectangle.endFill();
        self.gameScene.addChild(rectangle);


        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i === randomx && j === randomy) {
              let block2 = this.createOneColor(posx - n * size / 2 + i * size + i * margin, posy + j * size + j * margin, size, color2, 5);
              block2.interactive = true;
              block2.buttonMode = true;
              block2.click = function (event) {
                if (self.difficult > 12) {
                  self.setAGame(self.renewDifficult(true));
                } else {
                  self.end();
                }

              };
            } else {
              let block1 = self.createOneColor(posx - n * size / 2 + i * size + i * margin, posy + j * size + j * margin, size, color1, 5);
              block1.interactive = true;
              block1.buttonMode = true;
              block1.click = function (event) {
                self.error++;
                self.healthBar.outer.width -= self.windowWidth / 5;
                if (self.healthBar.outer.width > 0) {
                  self.setAGame(self.renewDifficult(false));
                } else {
                  self.end();
                }
              };
            }
          }
        }
      },

      end: function () {
        this.finalScore = this.initDifficult - this.difficult - this.error * 4;
        if (this.finalScore < 0) {
          this.finalScore = 0;
        }
        this.score.text = this.finalScore;
        this.score.x = this.windowWidth / 2 - this.score.width / 2;
        this.gameScene.visible = false;
        this.gameOverScene.visible = true;
        if (document.getElementById('btn-set')) {
          document.getElementById('btn-set').style.display = 'inline-block';
        }
        this.myTicker.stop()
      },

      renewDifficult: function (descrese) {
        if (descrese) {
          this.difficult -= this.difficult / 4;
          if (this.difficult < 12) {
            this.difficult = 12;
          } else {
            this.difficult = parseInt(this.difficult);
          }
        } else {
          this.difficult += this.difficult;
          if (this.difficult > 120) {
            this.difficult = 120;
          } else {
            this.difficult = parseInt(this.difficult);
          }
        }
      },

      randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      createOneColor: function (colorx, colory, size, color, rad) {
        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(color);
        rectangle.drawRoundedRect(colorx, colory, size, size, rad);
        rectangle.endFill();
        this.gameScene.addChild(rectangle);

        return rectangle;
      },

      hex2RgbArray: function (hex) {
        //十六进制转为RGB
        let rgb = []; // 定义rgb数组
        if (/^0x[0-9A-F]{3}$/i.test(hex)) {
          //判断传入是否为#三位十六进制数
          let sixHex = '#';
          hex.replace(/[0-9A-F]/ig, function (kw) {
            sixHex += kw + kw; //把三位16进制数转化为六位
          });
          hex = sixHex; //保存回hex
        }
        if (/^0x[0-9A-F]{6}$/i.test(hex)) {
          //判断传入是否为#六位十六进制数
          hex.replace(/[0-9A-F]{2}/ig, function (kw) {
            rgb.push(parseInt(kw, 16)); //十六进制转化为十进制并存入数组
          });
        } else {
          console.log("Input " + hex + " is wrong!");
        }
        return rgb; //输出RGB格式颜色
      },

      checkColor: function (color) {
        if (color >= 0 && color <= 255) {
          return true;
        } else {
          return false;
        }
      },


      rgbArray2Hex: function (array) {
        let str = "rgb(" + array[0] + "," + array[1] + "," + array[2] + ")";
        return this.rgb2Hex(str);
      },


      rgb2Hex: function (rgb) {
        if (/^rgb\((\d{1,3},){2}\d{1,3}\)$/i.test(rgb)) {
          //test RGB
          let hex = '0x'; //定义十六进制颜色变量
          rgb.replace(/\d{1,3}/g, function (kw) {
            //提取rgb数字
            kw = parseInt(kw).toString(16); //转为十六进制
            kw = kw.length < 2 ? 0 + kw : kw; //判断位数，保证两位
            hex += kw; //拼接
          });
          return hex; //返回十六进制
        } else {
          console.log("Input " + rgb + " is wrong!");
          return '0x000'; //输入格式错误,返回#000
        }
      }


    }
  }
</script>


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
