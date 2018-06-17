import THREE from './libs/three.js/three'

var TWEEN = require('@tweenjs/tween.js');

var CUBE_GAME = require('./cube');
require('./libs/three.js/Projector')


var cube_game = new CUBE_GAME();
var game_size = 7;
var next_cube;
var GAP = 60;
var POS = {
  x: -80,
  y: 0,
  z: -150
}
var GRAPHICS = {
  height: 15,
  width: 20
}

var renderer;
var scene;
var camera;
var controls;


var Object_Setting = function (type, x, y, mygraphics) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.mygraphics = mygraphics;
};


export function create() {

  scene = new THREE.Scene();
  create_camera();
  create_render();
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  create_light();
  create_seats();
  start_game();
  var projector = new THREE.Projector();
  document.addEventListener('click', clickCube, false);
}

function create_render() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}


function create_seat(x, y, type) {

  var color;
  if(type) {
      color = 0xaaaaaa;
  }else {
    color = 0xffffff;
  }
  var seat = new THREE.Mesh(new THREE.BoxGeometry(48, 1, 48), new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  }));
  seat.name = 'place_' + x + '_' + y;
  seat.position.set(x * GAP + POS.x, POS.y, y * GAP + POS.z);
  seat.cube_msg = new Object_Setting('seat', x, y, 0);
  return seat;
}

function create_camera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  scene.add(camera);
  camera.position.set(0, 500, -600);
  camera.lookAt(scene.position);
}

function create_light() {
  var light1 = new THREE.DirectionalLight(0xffffff, 0.6);
  light1.position.set(-1000, 1000, 1000);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(1000, 1000, -1000);
  scene.add(light2);

  var light3 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  light3.color.setHSL(0.6, 1, 0.6);
  light3.groundColor.setHSL(0.095, 1, 0.75);
  light3.position.set(0, 1000, 0);
  scene.add(light3);
  var sky = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), new THREE.MeshBasicMaterial(
    {color: 0xeeeeee, side: THREE.BackSide}));
  scene.add(sky);
}


function create_seats() {
  var obj;
  // base floor
  for (var y = 0; y < game_size; y++)
    for (var x = 0; x < game_size; x++) {
      obj = create_seat(x, y, false);
      scene.add(obj);
    }

  obj = create_seat(-2, 3, true);
  obj.name = 'next_seat';
  scene.add(obj);
}


function scale_cube(obj, mygraphics) {
  var x = obj.cube_msg.x;
  var y = obj.cube_msg.y;
  var figsize = (mygraphics > 99) ? mygraphics - 100 : mygraphics;
  obj.position.set(x * GAP + POS.x, figsize * GRAPHICS.height / 2.0 + POS.y, y * GAP + POS.z);
  obj.scale.set(1 + figsize * 0.1, figsize, 1 + figsize * 0.1);
}


function create_cube(x, y, mygraphics) {
  var color;
  if (mygraphics > 99)
    color = 0x67C23A;
  else
    color = 0xE6A23C;

  var Material = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide});
  var cubeGeometry = new THREE.BoxGeometry(GRAPHICS.width, GRAPHICS.height, GRAPHICS.width);
  var cube = new THREE.Mesh(cubeGeometry, Material);
  scene.add(cube);
  cube.name = 'cube_' + x + '_' + y;
  cube.cube_msg = new Object_Setting('cube', x, y, mygraphics);
  scale_cube(cube, mygraphics);
  return cube;
}

function change_cube_size(obj, new_fig) {

  var fo = {f: obj.cube_msg.mygraphics};
  var fo_end = {f: new_fig};
  var tween = new TWEEN.Tween(fo)
    .to(fo_end, 1000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function () {
      scale_cube(obj, fo.f);
    })
    .start();
}

function update_board() {
  for (var y = 0; y < game_size; ++y) {
    for (var x = 0; x < game_size; ++x) {
      var mygraphics = cube_game.get_cube(x, y);
      var obj = scene.getObjectByName('cube_' + x + '_' + y);
      if (mygraphics > 0) {
        if (!obj)
          obj = create_cube(x, y, mygraphics);
        if (obj && (obj.cube_msg.mygraphics !== mygraphics)) {
          change_cube_size(obj, mygraphics);
          obj.cube_msg.mygraphics = mygraphics;
        }
      } else {
        if (obj) {
          scene.remove(obj);
          obj = null;
        }
      }
    }
  }
  document.getElementById('dbscorev').innerHTML = cube_game.total_num();
  if (cube_game.game_over())
    document.getElementById('dblog').innerHTML = 'GAME OVER';
  else
    document.getElementById('dblog').innerHTML = '';

}


function move_cube_to_seat(mygraphics, seat) {
  var tween = new TWEEN.Tween(mygraphics.position)
    .to({x: seat.position.x, z: seat.position.z}, 2000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onComplete(update_board)
    .start();
};


function start_game() {
  cube_game.new_game();
  next_cube = create_cube(-2, 3, cube_game.next_cube());
  update_board();
}


function move_cube(seat) {

  var x = seat.cube_msg.x;
  var y = seat.cube_msg.y;
  cube_game.move_cube(x, y);
  next_cube.cube_msg.x = x;
  next_cube.cube_msg.y = y;
  next_cube.name = 'cube_' + x + '_' + y;
  move_cube_to_seat(next_cube, seat);
  next_cube = create_cube(-2, 3, cube_game.next_cube());
}


export function gameloop() {
  requestAnimationFrame(gameloop);
  renderer.render(scene, camera);
  controls.update();
  TWEEN.update();
}

function catchClickCube(event) {
  var x = (event.clientX / window.innerWidth) * 2 - 1;
  var y = -((event.clientY - 60) / window.innerHeight) * 2 + 1;
  var v = new THREE.Vector3(x, y, 1);
  v.unproject(camera);
  var ray = new THREE.Raycaster(camera.position, v.sub(camera.position).normalize());
  var intersects = ray.intersectObjects(scene.children);
  return (intersects.length > 0) ? intersects[0].object : null;
}


function clickCube(event) {
  var obj = catchClickCube(event);

  if (obj && obj.cube_msg) {
    if (obj.cube_msg.type === 'seat') {
      if (cube_game.can_move(obj.cube_msg.x, obj.cube_msg.y)) {
        move_cube(obj);
      }
    }


  }

};




