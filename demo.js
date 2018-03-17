// var type = "WebGL";

// if (!PIXI.utils.isWebGLSupported()) {
//     type = "canvas";
// }

//别名
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Rectangle = PIXI.Rectangle,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle


//Create a Pixi Application
let app = new Application({
    width: 256,
    height: 256,
    antialias:true,//antialias使得字体的边界和几何图形更加圆滑
    transparent:true,
    resolution:1//resolution让Pixi在不同的分辨率和像素密度的平台上运行变得简单
});

// app.renderer.backgroundColor = 0x86bebb;
// app.renderer.autoResize = true;
// app.renderer.resize(512,512)

app.renderer.view.style.position = "absolute"
app.renderer.view.style.display = "block"
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth,window.innerHeight)


//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
loader
    .add([
        "images/frog.png",
        "images/snail.png",
        "images/bee.png"
    ])
    .load(setup)
    // .on("progress",loadProgressHandler)
    // .load(setup);

function loadProgressHandler(loader, resource) {
    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);

    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
}

let frog, state,snail,bee,message,rectangle;




//This `setup` function will run when the image has loaded
function setup() {

    rectangle = new Graphics()
    rectangle.beginFill(0x86bebb)
    rectangle.lineStyle(4,0x000000,0.5)
    rectangle.drawRect(0,0,200,100)
    rectangle.endFill()
    rectangle.x = 200
    rectangle.y = 300
    app.stage.addChild(rectangle)

    let circle = new Graphics()
    circle.beginFill(0x392930)
    circle.drawCircle(0,0,50)
    circle.endFill()
    circle.x = 600
    circle.y = 400
    app.stage.addChild(circle)

    let ellipse = new Graphics();
    ellipse.beginFill(0xFFFF00);
    ellipse.drawEllipse(0, 0, 50, 20);
    ellipse.endFill();
    ellipse.x = 100;
    ellipse.y = 100;
    app.stage.addChild(ellipse);

    let roundBox = new Graphics();
    roundBox.lineStyle(4, 0x99CCFF, 1);
    roundBox.beginFill(0xFF9933);
    roundBox.drawRoundedRect(0, 0, 84, 36, 10)
    roundBox.endFill();
    roundBox.x = 48;
    roundBox.y = 190;
    app.stage.addChild(roundBox);

    let line = new Graphics()
    line.lineStyle(2,0x000000,1)
    line.moveTo(5,5)
    line.lineTo(20,30)
    line.x = 0
    line.y = 0
    app.stage.addChild(line)


    let triangle = new Graphics()
    triangle.beginFill(0x86bebb)
    triangle.drawPolygon( [
        100,10,
        150,20,
        100,50
    ])
    triangle.endFill()
    triangle.x = 200
    triangle.y = 50
    app.stage.addChild(triangle)

    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 40,
        fill: "white",
        stroke: "#7f7f7f",
        strokeThickness:4,
        dropShadow:true,
        dropShadowColor:"#000000",
        dropShadowBlur:4,
        dropShadowAngle:Math.PI/6,
        dropShadowDistance:6

    })


    message = new Text("hello world",style)
    app.stage.addChild(message)
    message.position.set(400,50)
    message.text = "hi!"
    message.style = {fill:"black",font: "16px PetMe64"}


    //Create the cat sprite
    frog = new Sprite(resources["images/frog.png"].texture);
    frog.position.set(100,100)
    snail = new Sprite(resources["images/snail.png"].texture);
    snail.position.set(300,100)
    bee = new Sprite(resources["images/bee.png"].texture);
    bee.position.set(500,100)


    let animals = new Container()
    animals.addChild(frog)
    animals.addChild(snail)
    animals.addChild(bee)

    app.stage.addChild(animals)
    // console.log(animals.children)
    animals.position.set(50,50)

    // console.log(frog.x)
    // console.log(animals.toGlobal(frog.position))
    // console.log(frog.parent.toGlobal(frog.position))
    // console.log(frog.getGlobalPosition())
    // console.log(frog.toLocal(frog.position,snail))


    frog.vx = 0;
    frog.vy = 0;
    // frog.x = 300;
    // frog.y = 200;


    // frog.anchor.set(0.5,0.5)
    // frog.rotation = 0.5


    //Add the cat to the stage

    // frog.visible = false;

    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));

    var speed = 5;



    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = () => {
        frog.vx = speed;
        frog.vy = 0;
    }

    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && frog.vy === 0) {
            frog.vx = 0;
        }
    };

    right.press = () => {
        frog.vx= - speed;
        frog.vy = 0;

    }
    right.release = () => {
        if (!left.isDown && frog.vy === 0) {
            frog.vx = 0;
        }
    };

    up.press = () =>{
        frog.vx = 0;
        frog.vy=speed;
    }
    up.release = () => {
        if (!down.isDown && frog.vx === 0) {
            frog.vy = 0;
        }
    };


    down.press = ()=>{
        frog.vx = 0;
        frog.vy=-speed;
    }

    down.release = () => {
        if (!up.isDown && frog.vx === 0) {
            frog.vy = 0;
        }
    };

}

function gameLoop(delta){

    //Update the current game state:
    state(delta);
}


function play(delta){


        frog.x -= frog.vx;
        frog.y -= frog.vy;


        if(hitTestRectangle(frog,rectangle)){
            message.text = "hit!"
            rectangle.tint = 0xff3300
        }else {
            message.text = "safe..."
            rectangle.tint = 0x392930
        }

}


function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};


function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

