
// ******************
// MOVEMENT BEHAVIORS
function move(component, direction, pace) {
  if (direction === "up") {
    // component.speedY -= pace
    console.log(currentFrame, component, direction, pace)
  }
  if (direction === "down") {
    // component.speedY += pace
    // component.speedX = 0
    console.log(currentFrame, component, direction, pace)
  }
  if (direction === "left") {
    // component.speedX -= pace
    component.speedX = 0

    console.log(currentFrame, component, direction, pace)
  }
  if (direction === "right") {
    // component.speedX += pace
    console.log(currentFrame, component, direction, pace)
  }
}
function stopMove(component) {
  component.speedY = 0;
  component.speedX = 0;
}

const enemigoA = {
  name: "El Malo",
  vigilando: ["down", "down", "right", "up", "right", "up", "left", "left"]
}

const enemigoB = {
  name: "Boss",
  vigilando: ["up", "up", "right", "down", "right", "down", "left", "up", "left", "down"]
}

let enemies = [enemigoA,enemigoB]

let currentFrame = 0;

const frameRate = 60
// calcular en qué frame estoy. En base a ese frame es el movimiento que debe hacer el personaje
function movimiento(enemigo){
  return (currentFrame / frameRate * 2) % (enemigo.vigilando.length);
}

function updateFrame() {

  enemies.forEach(enemy => move(enemy, enemy.vigilando[movimiento(enemy)], 10))

  currentFrame++
}


setInterval(updateFrame, 1000 / frameRate);