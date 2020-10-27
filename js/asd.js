let canvas = document.getElementById("ejemplo");
let context = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

context.font = "2em Arial";
context.fillText("Hola!",100,50)

context.moveTo(canvas.width / 2, canvas.height / 2);
context.lineTo(canvas.width , canvas.height )
context.stroke();

context.beginPath();
context.arc(95, 50, 40, degToRad(-90), degToRad(90));
context.stroke();


// FUNCIONES AUXILIARES

function degToRad(deg) {
  return deg * Math.PI / 180;
}