(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  };
  
  var Coord = SnakeGame.Coord = function (i, j) {
    this.i = i;
    this.j = j;
  };
  
  Coord.prototype.equals = function (coord2) {
    return (this.i === coord2.i) && (this.j === coord2.j);
  };
  
  Coord.prototype.isOpposite = function (coord2) {
    return (this.i === (-1 * coord2.i)) && (this.j === (-1 * coord2.j));
  };
  
  Coord.prototype.plus = function (coord2) {
    return new Coord(this.i + coord2.i, this.j + coord2.j);
  };
  
  var Apple = SnakeGame.Apple = function (board) {
    this.board = board;
    this.replace();
  };
  
  Apple.prototype.replace = function () {
    var x = Math.floor(Math.random() * this.board.dim);
    var y = Math.floor(Math.random() * this.board.dim);
    
    this.position = new Coord(x, y);
  };
  
  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "U";
    this.board = board;
    
    var center = new Coord(board.dim / 2, board.dim / 2);
    this.segments = [center];
    
    this.growTurns = 0;
  };
  
  Snake.DIRS = {
    "U": new Coord(-1, 0),
    "R": new Coord(0, 1),
    "D": new Coord(1, 0),
    "L": new Coord(0, -1)
  };
  
  Snake.SYMBOL = "D";
  Snake.GROW_TURNS = 3;
  
  Snake.prototype.eatApple = function () {
    if (this.head().equals(this.board.apple.position)) {
      this.growTurns += 3;
      return true;
    } else {
      return false;
    }
  };
  
  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };
  
  Snake.prototype.isValid = function () {
    var head = this.head();
    
    if (!this.board.validPosition(this.head())) {
      return false;
    }
    
    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }
    
    return true;
  };
  
  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRS[this.dir]));
    
    if (this.eatApple()) {
      this.board.apple.replace();
    }
    
    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }
    
    if (!this.isValid()) {
      this.segments = [];
    }
  };
  
  Snake.prototype.turn = function (dir) {
    if ((this.segments.length > 1) && 
      Snake.DIRS[this.dir].isOpposite(Snake.DIRS[dir])) {
      return;
    } else {
      this.dir = dir;
    }
  };
  
  var Board = SnakeGame.Board = function (dim) {
    this.dim = dim;
    
    this.apple = new Apple(this);
    this.snake = new Snake(this);
  };
  
  Board.BLANK_SYMBOL = ".";
  
  Board.blankGrid = function (dim) {
    var grid = [];
    
    for (var i = 0; i < dim; i++) {
      var row = [];
      for (var j = 0; j < dim; j++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }
    
    return grid;
  };
  
  Board.prototype.render = function () {
    var grid = Board.blankGrid(this.dim);
    
    this.snake.segments.forEach(function (segment) {
      grid[segment.i][segment.j] = Snake.SYMBOL;
    });
    
    grid[this.apple.position.i][this.apple.position.j] = Apple.SYMBOL;
    
    var rowStrs = [];
    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };
  
  Board.prototype.validPosition = function (coord) {
    return (coord.i >= 0) && (coord.i <= 19) && (coord.j >= 0) && (coord.j <= 19);
  };
  
})();