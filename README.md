# MyWebGame

### 安装node.js

[官网](https://nodejs.org/en/download/)下载安装

在当前项目文件夹

```
$ npm init
```

###安装http-server

```
$ npm install http-server
```

[下载demo](https://github.com/indexzero/http-server)

```
$ npm i
$ node bin/http-server
```

访问 http://localhost:8080 进行测试

### 安装Pixi.js

在当前项目文件夹

```
$ npm install pixi.js
```

添加 index.html，这个作为游戏的页面。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>pixi game demo</title>
    <script src="node_modules/pixi.js/dist/pixi.min.js"></script>
</head>
<body>
<script src="demo.js"></script>
</body>
</html>
```

其中 `demo.js` 放置我们的游戏脚本代码。我们在 `demo.js` 里面添加一些测试代码：

```
var type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

PIXI.utils.sayHello(type);
```

现在访问页面，查看控制台，输出如下信息：

```
  Pixi.js 4.3.5 - ✰ WebGL ✰      http://www.pixijs.com/    ♥♥♥ 
```