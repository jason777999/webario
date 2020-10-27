

// PARAMS & INITIALIZATIONS
const directions = ["up", "down", "left", "right"]
let currentFrame = 0;
const frameRate = 60

let coins = [];
let enemies =[];
let score = 0;
let scorelimit=0;
const coinSound = new Sound("sound/Mario-coin-sound.mp3");
const damageSound = new Sound("sound/Mario-coin-sound.mp3");
const lostSound = new Sound("sound/Game-over-ident.mp3")
$('.modal').on('shown.bs.modal', function () {$('.continue').trigger('focus')})




let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.widthFactor=57;
    this.heightFactor=40;
    this.canvas.width = this.canvas.widthFactor * vw;
    this.canvas.height = this.canvas.heightFactor * vh;
    this.context = this.canvas.getContext("2d");
    this.context.fillRect(10, 10, this.canvas.width, this.canvas.height)
    const playfield = document.querySelector("#playfield");
    playfield.insertBefore(this.canvas, playfield.childNodes[2])

    this.interval = setInterval(updateGameArea, 1000 / frameRate);

    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false;
      //   stopMove(player);
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  resize: function() {
    this.canvas.width = this.widthFactor * vw;
    this.canvas.height = this.heightFactor * vh;
  },
  over: function(state) {
    state == "won" ? 
    ($('#gameWin').modal('show'),clearInterval(this.interval)):
    (lostSound.play(),player.image.src="img/lost.png",player.update(),$('#gameOver').modal('show'),clearInterval(this.interval));  
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
  vh >= vw ? [myGameArea.widthFactor, myGameArea.heightFactor]=[70,40] : [myGameArea.widthFactor, myGameArea.heightFactor]=[56,60] ;
  myGameArea.resize();
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
  this.play = function(){
    //seteo el currentTime en 0 para que corte el sonido si agarro 2 monedas juntas
    this.sound.currentTime = 0;
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// ******************
// Component constructor
function component(width, height, fill, x, y,type) {
  ctx = myGameArea.context;
  this.type=type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.fill = fill;
  this.state =""; 
  if (type == "image") {
    this.image = new Image();
    this.image.src = fill;
  }
  // Component Methods
  // --Keeps component inside the field
  this.hitBorders = function() {
    const bottom = myGameArea.canvas.height - this.height;
    this.y > bottom ? (this.y = bottom, this.speedY = 0) : null;
    this.y < 0 ? (this.y = 0, this.speedY = 0) : null;
    const rightBorder = myGameArea.canvas.width - this.width;
    this.x > rightBorder ? (this.x = rightBorder, this.speedX = 0) : null;
    this.x < 0 ? (this.x = 0, this.speedX = 0) : null;
  }
  // --calculates component's new position in this frame
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitBorders();
  }

  
  
  // --Re-draws the component on each frame in its new position
  this.update = function() {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = fill;
      ctx.fillText(this.text, this.x, this.y);
    }else if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
      } else {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      this.newPos()
    }
    // --Checks if the component is crashing with another component
    this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) ||
      (mytop > otherbottom) ||
      (myright < otherleft) ||
      (myleft > otherright)) {
        crash = false;
      }
      return crash;
    }
    // --Coin method: plays coin sound, adds 1 to score and deletes 'this' coin from the array
    this.touch = function() {
      coinSound.play();
      score += 1;
      coins.splice(coins.indexOf(this), 1);
    }
    
  }
  
  // ******************
  // MOVEMENT BEHAVIORS
  function move(component, direction, pace) {
    if (direction === "up") {
      component.speedY -= pace
    }
    if (direction === "down") {
      component.speedY += pace
    }
    if (direction === "left") {
      component.speedX -= pace
    }
    if (direction === "right") {
    component.speedX += pace
  }
}
function stopMove(component) {
  component.speedY = 0;
  component.speedX = 0;
}
// calcular en qué frame estoy. En base a ese frame es el movimiento que debe hacer el personaje
function movimiento(enemigo){
  return (currentFrame / frameRate * 2) % (enemigo.vigilando.length);
}
// ******************
// RENDERS
function render(){
  myGameArea.clear();
  coins.forEach(coin => coin.update())  
  enemies.forEach(enemy => enemy.update())  
  boss.update();
  player.update();
  myScore.update()
  // typeof myScore!=="undefined" ? myScore.update():null;
}

function updateGameArea() {
  // --Updates score and checks if the player won
  myScore.text="SCORE: " + score;
  document.querySelector("#score").innerText = score;
  score >= scorelimit ? myGameArea.over("won") : null;
  // --Checks for collisions
  coins.forEach(coin => player.crashWith(coin)?coin.touch():null);
  enemies.forEach( enemy =>{player.crashWith(enemy)?(myGameArea.over("Lost")):null;})
  player.crashWith(boss)?(myGameArea.over("Lost")):null;
  // --Enemies movement
  enemies.forEach(enemy=>move(enemy, directions[random(0, 4)], random(0, 2) * .45) )  
  move(boss,boss.vigilando[movimiento(boss)],1.5)
  // --Sets speed based on pressed keys in this frame.
  if (myGameArea.keys && myGameArea.keys[37]) {move(player, 'left', .1)}
  if (myGameArea.keys && myGameArea.keys[39]) {move(player, 'right', .1)}
  if (myGameArea.keys && myGameArea.keys[38]) {move(player, 'up', .1)}
  if (myGameArea.keys && myGameArea.keys[40]) {move(player, 'down', .1)}
  // --Calls the render function
  updateSize()
  render()
  currentFrame++
  
}



function startGame(dificulty) {
  let dificulties ={
    easy:[1,enemies,"enemyParams"],
    normal:[3,enemies,"enemyParams"],
    hard:[5,enemies,"enemyParams"]
  }
  document.querySelector("#start").classList = "d-none";
  document.querySelector("#playfield").classList.remove("d-none");
  document.querySelector("#playfield").classList.add("d-flex", "flex-wrap");
  myScore = new component("1.5em", "wayoshi", "white", 3*vw, 5*vh, "text");
  player = new component(50, 50, "img/running2.gif", 10, 120, "image")      
  boss = new component(50, 50, "img/thwomp.png", 250, 150, "image")     
  boss.vigilando= ["up", "down", "up", "down", "right", "left", "down", "up", "right", "left", "down", "up", "left", "right", "up", "down", "left", "right", "down", "up"];
  function createComponents(quantity, componentArray, componentParams) {
    for (let index = 0; index < quantity; index++) {
    params={
      enemyParams : [40, 40, "img/goomba.gif", 70 * vw - - random(-35, 15) * vw, 120, "image"],
      coinParams : [10, 30, "img/coin_lowres.png", 70 * vw /2 - random(-35, 15) * vw, 40 * vh/2 -  random(-15, 15) * vh ,"image"]
    }
      componentArray.push(new component(...params[componentParams]));
    } 
  }
  createComponents(...dificulties[dificulty]);
  createComponents(5,coins,"coinParams")
  scorelimit=coins.length;
  myGameArea.start();
}