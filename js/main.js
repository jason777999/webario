// PARAMS & INITIALIZATIONS
const directions = ["up", "down", "left", "right"]
let currentFrame = 0;
const frameRate = 60

let player =null;
let coins = [];
let enemies = [];
let boss = null;

let score = 0;
const coinSound = new Sound("sound/Mario-coin-sound.mp3");
const damageSound = new Sound("sound/Mario-coin-sound.mp3");
const lostSound = new Sound("sound/Game-over-ident.mp3")
const lostSprite = new Image()
lostSprite.src = "img/lost.png";
$('.modal').on('shown.bs.modal', function () { $('.continue').trigger('focus') })




let game = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.keys = (game.keys || []);
    this.interval = setInterval(updateGameArea, 1000 / frameRate);
    this.widthFactor = 57;
    this.heightFactor = 40;
    this.canvas.width = this.canvas.widthFactor * vw;
    this.canvas.height = this.canvas.heightFactor * vh;
    this.context = this.canvas.getContext("2d");
    this.context.fillRect(10, 10, this.canvas.width, this.canvas.height)
    const playfield = document.querySelector("#playfield");
    playfield.insertBefore(this.canvas, playfield.childNodes[2]);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  resize: function () {
    this.canvas.width = this.widthFactor * vw;
    this.canvas.height = this.heightFactor * vh;
  },
  over: function (state) {
    if (state == "won") {
      $('#gameWin').modal('show');
    } else if (state == "lost") {
      lostSound.play();
      $('#gameOver').modal('show');
    }
    clearInterval(this.interval)
  }
}

// ******************
// AUX FUNCTIONS

// Fixes unnecessary scrolling in mobile
let vh, vw;
function updateSize() {
  vh = window.innerHeight * 0.01;
  vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  vh >= vw ? [game.widthFactor, game.heightFactor] = [80, 40] : [game.widthFactor, game.heightFactor] = [56, 60];
  game.resize();
}
window.addEventListener("resize", updateSize)
updateSize();


function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// ******************
// Sound constructor
function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.volume = 0.1;
  document.body.appendChild(this.sound);
  this.play = function () {
    //seteo el currentTime en 0 para que corte el sonido si agarro 2 monedas juntas
    this.sound.currentTime = 0;
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}

// ******************
// Component constructor
function Component(width, height, fill, x, y, type) {
  ctx = game.context;
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.fill = fill;
  this.state = "";
  this.frameX = 0;
  this.frameY = 0;
  if (type == "image") {
    this.image = new Image();
    this.image.src = fill;
  }
  // Component Methods
  // --Keeps Component inside the field
  this.hitBorders = function () {
    const bottom = game.canvas.height - this.height;
    this.y > bottom ? (this.y = bottom, this.speedY = 0) : null;
    this.y < 0 ? (this.y = 0, this.speedY = 0) : null;
    const rightBorder = game.canvas.width - this.width;
    this.x > rightBorder ? (this.x = rightBorder, this.speedX = 0) : null;
    this.x < 0 ? (this.x = 0, this.speedX = 0) : null;
  }
  // --calculates Component's new position in this frame
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitBorders();
  }

  // --Re-draws the Component on each frame in its new position
  this.update = function () {
    ctx = game.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = fill;
      ctx.fillText(this.text, this.x, this.y);
    } else if (type == "image") {

      if (this === player) {
        this.widthImage = 84;
        this.heightImage = 89;
        ctx.drawImage(this.image, this.frameX * this.widthImage, this.frameY * this.heightImage, this.widthImage, this.heightImage, this.x, this.y, this.width, this.height)

      } else {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)

      }
    } else {
      ctx.fillStyle = this.fill;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos()
    this.frameX++
  }
  // --Checks if the Component is crashing with another Component
  this.crashWith = function (otherobj) {
    const myleft = this.x;
    const myright = this.x + (this.width);
    const mytop = this.y;
    const mybottom = this.y + (this.height);
    const otherleft = otherobj.x;
    const otherright = otherobj.x + (otherobj.width);
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + (otherobj.height);
    let crash = true;
    if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
  // --Coin method: plays coin sound, adds 1 to score and deletes 'this' coin from the array
  this.touch = function () {
    coinSound.play();
    score += 1;
    coins.splice(coins.indexOf(this), 1);
  }

}

// ******************
// MOVEMENT BEHAVIORS
function move(character, direction, pace) {
  if (direction === "up") {
    character.speedY -= pace
    if(character == player) character.frameY = 3
  }
  if (direction === "down") {
    character.speedY += pace
    if(character == player) character.frameY = 2
  }
  if (direction === "left") {
    character.speedX -= pace
    if(character == player) character.frameY = 1
  }
  if (direction === "right") {
    character.speedX += pace
    if(character == player) character.frameY = 0
  }
}
function stopMove(character) {
  character.speedY = 0;
  character.speedX = 0;
}
function surveillance(character) {
  return (currentFrame / frameRate * 2) % (character.path.length);
}


// ******************
// RENDERS
function render() {
  game.clear();
  coins.forEach(coin => coin.update())
  enemies.forEach(enemy => enemy.update())
  if (boss) { boss.update(); }
  player.update();
  myScore.update()
}


function updateGameArea() {
  // --Updates score and checks if the player won.
  myScore.text = "SCORE: " + score;
  document.querySelector("#score").innerText = score;
  // If there are no more coins, you win.
  if (coins.length == 0) game.over("won");
  // --Checks for collisions.
  coins.forEach(coin => { if (player.crashWith(coin)) coin.touch() });
  enemies.forEach(enemy => { if (player.crashWith(enemy)) game.over("lost") });
  // --Enemies movement.
  enemies.forEach(enemy => move(enemy, directions[random(0, 4)], random(0, 2) * .45))
  // --Boss movement and collision detection.
  if (boss) {
    if (player.crashWith(boss)) game.over("lost");
    move(boss, boss.path[surveillance(boss)], 1.5)
  }

  // --Sets speed based on pressed keys in this frame.
  if (game.keys["left"]) { move(player, 'left', .1) }
  if (game.keys["right"]) { move(player, 'right', .1) }
  if (game.keys["up"]) { move(player, 'up', .1) }
  if (game.keys["down"]) { move(player, 'down', .1) }
  // --Calls the render function
  updateSize()
  render()

  player.frameX = ((currentFrame / frameRate * 11) % 11).toFixed()
  currentFrame++

}

// ******************
// KEYBOARD EVENTS (WASD and Arrows)
window.addEventListener('keydown', function (e) {
  switch (e.key) {
    case "ArrowLeft":
    case "a":
    case "A":
      game.keys["left"] = true
      break;
    case "ArrowRight":
    case "d":
    case "D":
      game.keys["right"] = true
      break;
    case "ArrowUp":
    case "w":
    case "W":
      game.keys["up"] = true
      break;
    case "ArrowDown":
    case "s":
    case "S":
      game.keys["down"] = true
      break;
  }
})
window.addEventListener('keyup', function (e) {
  game.keys = [];
})

function createComponents(quantity, componentArray, componentParams) {
  for (let index = 0; index < quantity; index++) {
    params = {
      enemyParams: [40, 40, "img/goomba.gif", 70 * vw - - random(-35, 15) * vw, 120, "image"],
      coinParams: [10, 30, "img/coin_lowres.png", 70 * vw / 2 - random(-35, 15) * vw, 40 * vh / 2 - random(-15, 15) * vh, "image"]
    }
    componentArray.push(new Component(...params[componentParams]));
  }
}


// ******************
// LET'S START THE GAME!!!!!
function startGame(dificulty) {
  let dificulties = {
    easy: [1, enemies, "enemyParams"],
    normal: [3, enemies, "enemyParams"],
    hard: [3, enemies, "enemyParams"]
  }
  
  document.querySelector("#start").classList = "d-none";
  document.querySelector("#playfield").classList.remove("d-none");
  document.querySelector("#playfield").classList.add("d-flex", "flex-wrap");
  
  if (dificulty == "hard") {
    boss = new Component(50, 50, "img/thwomp.png", game.canvas.width / 2, game.canvas.height / 2, "image")
    boss.path = ["up", "down", "up", "down", "right", "left", "down", "up", "right", "left", "down", "up", "left", "right", "up", "down", "left", "right", "down", "up"];
  }
  myScore = new Component("1.5em", "wayoshi", "white", 3 * vw, 5 * vh, "text");
  player = new Component(84 / 1.5, 89 / 1.5, "img/wario.png", 10, 120, "image")

  createComponents(...dificulties[dificulty]);
  createComponents(5, coins, "coinParams")
  game.start();
}


