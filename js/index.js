const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

window.onload = () => {
  document.getElementById('start-button').onclick = (e) => {
    startGame(e);
  };
};

const road = new Image();
road.src = "../images/road.png"
road.onload = () => {
  ctx.drawImage(road, 0, 0, 400,600)
}

const car = new Image();
car.src = "../images/car.png";
car.onload = () => {
  ctx.drawImage(car, canvas.width / 3 + 15, canvas.height - 200, 50, 100);
}



class Driver{
  constructor(){
    this.x= canvas.width / 3 + 15;
    this.y= canvas.height - 200;
    this.w= 40;
    this.h= 80;
    this.pic = car;
    this.score = 0;
  }
  
  move(direction){
   switch(direction){
    case "ArrowLeft":
      if (this.x <= canvas.width / 8) {
        this.x = canvas.width / 8
      } else {
        this.x -= 15
      }
      break;
    case "ArrowRight":
      if (this.x >= canvas.width -190) {
        this.x = canvas.width -190
      } else {
        this.x += 15
      }
      break;
    }
  }
}

let myDriver = new Driver();

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80
    this.height = 20;
  }

  createObst(newy) {
    ctx.fillStyle = 'red'
    ctx.fillRect(this.x, newy, this.width, this.height);
  }
}

let obstArr = [];

let obstFactory = setInterval(function() {
  let randX = Math.floor(Math.random() * ((canvas.width -190) - (canvas.width / 8)) + canvas.width / 8);
  let newObst = new Obstacle(randX, 0)
  obstArr.push(newObst);
}, 1700)

function startGame() {
  window.addEventListener('keydown', function(e) {
    switch(e.code){
      case "ArrowLeft":
        myDriver.move("ArrowLeft")
        break;
      case "ArrowRight":
        myDriver.move("ArrowRight")
        break;
      }
  })


  animate();
}

function didCollide(player, obj) {
  if (
    player.x < obj.x + obj.width &&
    player.x + player.w > obj.x &&
    player.y < obj.y + obj.height &&
    player.y + player.h > obj.y
  ){
    
    return true
  } else{
    return false
  }
}

let engine;

function animate () {
  engine = window.requestAnimationFrame(animate)
  ctx.clearRect(0,0, canvas.width, canvas.height)
  
  ctx.drawImage(road, 0, 0, 400,600)
  ctx.drawImage(myDriver.pic, myDriver.x, myDriver.y, 45, 90);

  for(let i = 0; i < obstArr.length; i++) {
    if (obstArr[i].y < canvas.height - 140) {
      obstArr[i].createObst(obstArr[i].y + 1)
      obstArr[i].y += 2
    } else {
      myDriver.score += 10;
      let score = document.getElementById("score-num");
      score.innerHTML = myDriver.score;
      obstArr.shift();  
    }
  
    if (didCollide(myDriver, obstArr[i])) {
      gameOver();
    }
  }
}



function gameOver() {
  console.log("GAME OVER!")
  window.cancelAnimationFrame(engine)
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.drawImage(road, 0, 0, 400,600)
  ctx.drawImage(myDriver.pic, myDriver.x, myDriver.y, 45, 90);
  document.getElementById("game-over").innerHTML = "GAME OVER";
}