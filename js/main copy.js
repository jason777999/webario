var myGamePiece;

function startGame() {
  // Oculto el boton START
  document.querySelector("#start").classList = "d-none";
  document.querySelector("#playfield").classList.remove("d-none");

  myGamePiece = new component(30, 30, "red", 10, 120);
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width= 70*vw;
    this.canvas.height= 40*vh;   
    this.context = this.canvas.getContext("2d");
    // Inserto el canvas dentro del div#playfield
    const playfield = document.querySelector("#playfield");
    playfield.insertBefore(this.canvas, playfield.childNodes[0])
      // playfield.appendChild(this.canvas);
      // Seteo la actualizacion en 20ms
    this.interval = setInterval(updateGameArea, 20);
    // Escucho el teclado fisico en caso de haber uno
    window.addEventListener('keydown', function(e) {
      e.preventDefault();
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })

  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  resize: function(){
    this.canvas.width= 70*vw;
    this.canvas.height= 40*vh;   
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function updateGameArea() {
  myGameArea.clear();  
  myGamePiece.newPos();
  myGamePiece.update();
}

function moveup() {
  myGamePiece.speedY -= 1;
}

function movedown() {
  myGamePiece.speedY += 1;
}

function moveleft() {
  myGamePiece.speedX -= 1;
}

function moveright() {
  myGamePiece.speedX += 1;
}

function movestop() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.moveAngle = 0;
  myGamePiece.speed = 0;
  if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX += -.1; }
  if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX += .1; }
  if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY += -.1; }
  if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY += .1; }
  if (myGameArea.keys && myGameArea.keys[32]) {
    myGamePiece.speedY = 0;
    myGamePiece.speedX = 0;
  }
  myGamePiece.newPos();
  myGamePiece.update();
}

// Fixes unnecessary scrolling in mobile
let vh , vw ;
function updateSize(){
  vh = window.innerHeight * 0.01;
  vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  myGameArea.resize();
}
window.addEventListener("resize",updateSize)
updateSize();