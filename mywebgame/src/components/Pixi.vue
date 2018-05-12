<template>
  <div class="pixi">
    <my-header activeIndex="/pixi"></my-header>
  </div>
</template>

<script>
  import * as pixi from 'pixi.js'
  import MyHeader from './MyHeader'

  export default {
    components: {MyHeader},
    name: 'PIXI',
    data() {
      return {
        winDifficult:15,
        backgroundColor: 0xffffff,
        app: {},
        title: {},
        score: 0,
        gameScene: {},
        gameOverScene: {},
        message: {},
        fontColor: 0x3f3f3f,
        difficult: 120
      }
    },
    mounted() {
      this.app = new pixi.Application({
        width: 512,
        height: 512,
        antialias: true, //antialias使得字体的边界和几何图形更加圆滑
        transparent: true,
        resolution: 1 //resolution让Pixi在不同的分辨率和像素密度的平台上运行变得简单
      }),
        this.$el.append(this.app.view)
      this.app.autoResize = true;
      this.app.renderer.resize(window.innerWidth, window.innerHeight);

      this.gameScene = new pixi.Container();
      this.app.stage.addChild(this.gameScene);
      this.gameOverScene = new pixi.Container();
      this.app.stage.addChild(this.gameOverScene);
      this.gameOverScene.visible = false;

      this.setAGame(120);

      let credit = new pixi.TextStyle({
        fontFamily: "Futura",
        fontSize: 48,
        fill: this.fontColor,
      });

      this.title = new pixi.Text("Score: " + this.score + ' Difficult: ' + this.difficult , credit);
      this.title.x = window.innerWidth / 2 - 230;
      this.title.y = 30;

      this.gameScene.addChild(this.title);

      const style = new pixi.TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: this.fontColor,
      });
      this.message = new pixi.Text("The End!", style);
      this.message.x = window.innerWidth / 2 - 150;
      this.message.y = window.innerHeight / 2 - 80;

      this.gameOverScene.addChild(this.message);

      pixi.state = this.play;
      this.app.ticker.add(delta => this.gameLoop(delta));

    },
    methods: {
      gameLoop: function (delta) {
        //Runs the current game `state` in a loop and renders the sprites
        pixi.state(delta);
      },

      play: function (delta) {

      },

      setAGame: function () {
        let ranColor = this.randomColor();
        let resultColor = this.getResultColor(ranColor);
        let num = parseInt(180 / this.difficult);
        num = num > 6 ? 6 : num;
        num = num < 2 ? 2 : num;
        this.createAllColor( window.innerWidth / 2, 150, num, window.innerWidth / 3 / num, 5, ranColor, resultColor);

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


      createAllColor: function ( posx, posy, n, size, margin, color1, color2) {
        let self = this;

        let randomx = self.randomInt(0, n - 1);
        let randomy = self.randomInt(0, n - 1);

        let rectangle = new pixi.Graphics();
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
                if (self.difficult > self.winDifficult) {
                  // console.log(self.difficult + ' ' + self.winDifficult)
                  self.score += 5;
                  self.setAGame(self.renewDifficult(self.difficult, true));
                  self.title.text = "Score: " + self.score  + ' Difficult: ' + self.difficult ;
                } else {
                  self.message.text = "You win!";
                  self.end();
                }
              };
            } else {
              let block1 = self.createOneColor(posx - n * size / 2 + i * size + i * margin, posy + j * size + j * margin, size, color1, 5);
              block1.interactive = true;
              block1.buttonMode = true;
              block1.click = function (event) {
                self.score -= 10;
                if (self.score >= 0) {
                  self.setAGame(self.renewDifficult(self.difficult, false));
                  self.title.text = "Score: " + self.score + ' Difficult: ' + self.difficult ;
                } else {
                  self.message.text = "You lose!";
                  self.end();
                }
              };
            }
          }
        }
      },

      end: function () {
        this.gameScene.visible = false;
        this.gameOverScene.visible = true;
      },

      renewDifficult: function ( descrese) {
        if (descrese) {
          this.difficult -= this.difficult / 4;
          if (this.difficult < 12) {
            this.difficult =  12;
          } else {
            this.difficult = parseInt(this.difficult);
          }
        } else {
          this.difficult += this.difficult / 2;
          if (this.difficult > 200) {
            this.difficult =  200;
          } else {
            this.difficult = parseInt(this.difficult);
          }
        }
      },

      randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },

      createOneColor: function (colorx, colory, size, color, rad) {
        let rectangle = new pixi.Graphics();
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
