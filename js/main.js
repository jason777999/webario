
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const directions = ["up", "down", "left", "right"]
let coins = [];
let score = 0;
let myScore;
var coinSound;

function startGame() {
    // Oculto el boton START
    document.querySelector("#start").classList = "d-none";
    document.querySelector("#playfield").classList.remove("d-none");
    myScore = new component("30px", "Consolas", "purple", 280, 40, "text");
    player = new component(50, 50, "img/running.webp", 10, 120, "image")
    for (let index = 0; index < 5; index++) {
      const coinName = "coin" + index;
      window[coinName] = new component(10, 30, "img/coin_lowres.png", 70 * vw - index * random(17, 160), 40 * vh - index * random(17, 40),"image");
      coins.push(window[coinName])
    }
    enemy =new component(40, 40, "img/goomba.gif", 70 * vw - random(17, 160), 120, "image");
    coinSound = new sound("sound/Mario-coin-sound.mp3");
    
    myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 70 * vw;
    this.canvas.height = 40 * vh;
    this.context = this.canvas.getContext("2d");
    this.context.fillRect(10, 10, this.canvas.width, this.canvas.height)
    const playfield = document.querySelector("#playfield");
    playfield.insertBefore(this.canvas, playfield.childNodes[0])

    this.interval = setInterval(updateGameArea, 20);

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
    this.canvas.width = 70 * vw;
    this.canvas.height = 40 * vh;
  },
  // touch: function(coin) {
  //   coin.touch();
   
  // },
  over: function(state) {
    state == "won" ? alert("Yay! You won"):(player.update(),alert("Game over... Loser"));    
    clearInterval(this.interval);

  }
}

function component(width, height, color, x, y,type) {
  ctx = myGameArea.context;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.color = color;
  this.state ="";

  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitBorders();
  }

  this.touch = function() {
    ctx = myGameArea.context;
    this.x = -100;
    this.y = -100;
    this.width = 0;
    this.height = 0;    
    ctx.fillRect(this.x, this.y, this.width, this.height);  
    if (this.state !=="found" ) {
      score += 1;
      this.state = "found";
      coinSound.play();
    }
    
  }

  this.update = function() {
    ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }else if (type == "image") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
    } else {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos()
  }
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
  this.hitBorders = function() {
    const bottom = myGameArea.canvas.height - this.height;
    this.y > bottom ? (this.y = bottom, this.speedY = 0) : null;
    this.y < 0 ? (this.y = 0, this.speedY = 0) : null;
    const rightBorder = myGameArea.canvas.width - this.width;
    this.x > rightBorder ? (this.x = rightBorder, this.speedX = 0) : null;
    this.x < 0 ? (this.x = 0, this.speedX = 0) : null;
  }
}



function updateGameArea() {
  if(score >4){
    myGameArea.over("won");
  }
    coins.forEach(coin => {
      if (player.crashWith(coin)) {
        coin.touch();
      }
    });
    if (player.crashWith(enemy)) {
      player.image.src="img/goomba.gif";      
      myGameArea.over("Lost");
    }
    // Movimientos del enemigo
    move(enemy, directions[random(0, 4)], random(0, 2) * .45)
    
    // movimientos segun tecla presionada
  if (myGameArea.keys && myGameArea.keys[37]) {
    move(player, 'left', .1)
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    move(player, 'right', .1)
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    move(player, 'up', .1)
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    move(player, 'down', .1)
  }
// renderizado
  myGameArea.clear();
  myScore.text="SCORE: " + score;
  
  typeof coin0 !=="undefined" ? coin0.update():null ;
  typeof coin1 !=="undefined" ? coin1.update():null ;
  typeof coin2 !=="undefined" ? coin2.update():null ;
  typeof coin3 !=="undefined" ? coin3.update():null ;
  typeof coin4 !=="undefined" ? coin4.update():null ;
  
  enemy.update();
  player.update();
  myScore.update();

  // console.log(score)
  // document.querySelector("#score").innerText = score;
  
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


// Fixes unnecessary scrolling in mobile
let vh, vw;

function updateSize() {
  vh = window.innerHeight * 0.01;
  vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  myGameArea.resize();
}
window.addEventListener("resize", updateSize)
updateSize();

// Add sound effects
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
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