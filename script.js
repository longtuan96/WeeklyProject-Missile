//Initialize the canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseClickHandler, false);
//mouse variable
let mouseMoveX = 0;
let mouseMoveY = 0;
let mouseClickX = 0;
let mouseClickY = 0;

//Variable for drawing
let gunbaseX = 0;
let gunbaseY = 0;
let gunbaseRadius = 40;
//let gunAngle = 40;

let gunX = 0;
let gunY = 0;
let gunLength = 40;
let gunAngle = 0;

//run once
requestAnimationFrame(render);
ctx.translate(canvas.width / 2, canvas.height);

function render() {
  ctx.clearRect(
    0 - canvas.width / 2,
    0 - canvas.height,
    canvas.width,
    canvas.height
  );
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //drawCircle();
  //drawPaddle();
  drawGun();
  // if (mouseClickHandler().mouseX != "undefined") {
  //   console.log(mouseClickHandler().mouseX);
  // }
  console.log(mouseMoveX);
  console.log(mouseClickX);
  requestAnimationFrame(render);
}

function drawCircle() {
  ctx.beginPath();
  ctx.arc(gunbaseX, gunbaseY, gunbaseRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#325FA2";
  ctx.fill();
  ctx.closePath();
}

function mouseMoveHandler(event) {
  mouseMoveX = event.clientX - canvas.offsetLeft - canvas.width / 2;
  mouseMoveY = event.clientY - canvas.offsetHeight;
  // console.log(`mouse x: ${mouseX}`);
  // console.log(`mouse y: ${mouseY}`);
}

function mouseClickHandler(event) {
  mouseClickX = event.clientX - canvas.offsetLeft - canvas.width / 2;
  mouseClickY = event.clientY - canvas.offsetHeight;
  // console.log(`mouse x click: ${mouseX}`);
  // console.log(`mouse y click: ${mouseY}`);
}

function drawGun() {
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(0, 0);
  ctx.lineTo(mouseMoveX, mouseMoveY);
  ctx.stroke();
}
