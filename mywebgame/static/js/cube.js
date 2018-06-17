var CUBEGAME = CUBEGAME || (function () {

  var _seat = [];
  var _game_size = 7;
  var _next_cube = 1;
  var _total_num = 0;


  function find_near(x, y) {
    var array = [];
    if (is_legal(x, y + 1))
      array.push([x, y + 1]);
    if (is_legal(x + 1, y))
      array.push([x + 1, y]);
    if (is_legal(x - 1, y))
      array.push([x - 1, y]);
    if (is_legal(x, y - 1))
      array.push([x, y - 1]);
    return array;
  }


  function find_same_cube_array(x, y, height) {
    var neighs = find_near(x, y);
    var nears_x = [];
    var nears_y = [];
    var pos = copy_seat();
    var object = height;
    var ral_x = []
    var ral_y = []
    neighs.forEach(function (neigh) {
      if (object === pos[neigh[1]][neigh[0]]) {
        if ((neigh[1] - y) === 0) {
          nears_x.push({
            x: neigh[0],
            y: neigh[1],
            offset: neigh[0] - x
          });
          ral_x.push([
            neigh[0],
            neigh[1]
          ])
        }
        else {
          nears_y.push({
            x: neigh[0],
            y: neigh[1],
            offset: neigh[1] - y
          });
          ral_y.push([
            neigh[0],
            neigh[1]
          ])
        }
      }
    });

    pos[y][x] = -object;

    nears_x.forEach(function (near) {
      var temp = {
        x: near.x + near.offset,
        y: near.y
      }
      while (is_legal(temp.x, temp.y)) {
        if (object === pos[temp.y][temp.x]) {
          ral_x.push([
            temp.x,
            temp.y
          ])
          temp = {
            x: temp.x + near.offset,
            y: temp.y
          }
        } else {
          break;
        }
      }
    });

    nears_y.forEach(function (near) {
      var temp = {
        x: near.x,
        y: near.y + near.offset
      }
      while (is_legal(temp.x, temp.y)) {
        if (object === pos[temp.y][temp.x]) {
          ral_y.push([
            temp.x,
            temp.y
          ])
          temp = {
            x: temp.x,
            y: temp.y + near.offset
          }
        } else {
          break;
        }
      }
    });

    var relation = ral_x.length > 1 ? ral_x : [];

    relation = ral_y.length > 1 ? relation.concat(ral_y) : relation

    return relation;
  }


  function new_seat() {
    var result = [];
    for (var y = 0; y < _game_size; ++y) {
      var relation = [];
      result.push(relation);
      for (var x = 0; x < _game_size; ++x) relation.push(0);
    }
    return result;
  };

  function is_legal(x, y) {
    return (x >= 0) && (x < _game_size) && (y >= 0) && (y < _game_size);
  }

  function index_of_seat(array, pos) {
    if ((!array) || (array.length === 0)) return -1;
    for (var i = 0; i < array.length; ++i) {
      if ((array[i][0] === pos[0]) && (array[i][1] === pos[1]))
        return i;
    }
    return -1;
  }


  function set_random_seat() {
    for (var i = 0; i < _game_size; ++i) {
      var x = Math.floor(Math.random() * _game_size);
      var y = Math.floor(Math.random() * _game_size);
      var height = randomHeight();
      set_cube(x, y, height);
    }
  }

  function _new_game() {
    _seat = new_seat();
    _total_num = 0;
    _next_cube = randomHeight();
    set_random_seat();
  }


  function _move_cube(x, y) {

    if (_seat[y][x] !== 0)
      return 0;

    var object = _next_cube;
    var num = 0;
    _next_cube = randomHeight();

    var same_cube_array = find_same_cube_array(x, y, object);

    if (same_cube_array.length < 2) {
      _seat[y][x] = object;
      _total_num += 10
      return
    }

    while (same_cube_array.length > 1) {
      object += 1;
      num += 10 * (same_cube_array.length + 1);
      same_cube_array.forEach(function (v) {
        _seat[v[1]][v[0]] = 0;
      });
      same_cube_array = find_same_cube_array(x, y, object);
    }
    _seat[y][x] = object;
    _total_num += num
  };

  function _game_over() {
    for (var i = 0; i < _game_size; i++)
      for (var j = 0; j < _game_size; j++)
        if (_seat[j][i] === 0)
          return false;
    return true;
  }


  function copy_seat() {
    var result = [];
    for (var y = 0; y < _game_size; ++y) {
      var relation = [];
      result.push(relation);
      for (var x = 0; x < _game_size; ++x) {
        relation.push(_seat[y][x]);
      }
    }
    return result;
  }


  function randomHeight() {
    var height = 1;
    var rand = Math.random();
    if (rand > 0.70)
      height = 2;
    if (rand > 0.90)
      height = 3;
    if (rand > 0.95)
      height = 4;
    if (Math.random() > 0.7)
      height += 100;
    return height;
  };


  function set_cube(x, y, height) {
    _seat[y][x] = height;
  }

  return {
    get_cube: function (x, y) {
      return _seat[y][x];
    },
    new_game: function () {
      _new_game();
    },
    game_over: function () {
      return _game_over();
    },
    move_cube: function (x, y) {
      return _move_cube(x, y);
    },
    can_move: function (x, y) {
      return _seat[y][x] === 0;
    },
    next_cube: function () {
      return _next_cube;
    },
    total_num: function () {
      return _total_num;
    },

  };

});

module.exports = CUBEGAME;
