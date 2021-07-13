var PLAY = 1
var END = 0;
var gameState=PLAY;

var trex, trexRunning, trexEnd;
var ground, invisGround, groundImage;

var cloudsGroup;
var cloudImage;
var obstaclesGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var desertImage, foggyImage, pebbleImage;

var score = 0;

var gameOver, gameOverImage;
var restart, restartImage;
 
function preload(){
  trexRunning = loadAnimation("images/trex1.png", "images/trex3.png", "images/trex4.png");
  trexEnd = loadImage("images/trex_collided.png");

  cloudImage = loadImage("images/cloud.png");

    obstacle1 = loadImage("images/obstacle1.png");
    obstacle2 = loadImage("images/obstacle2.png");
    obstacle3 = loadImage("images/obstacle3.png");
    obstacle4 = loadImage("images/obstacle4.png");
    obstacle5 = loadImage("images/obstacle5.png");
    obstacle6 = loadImage("images/obstacle6.png");

    groundImage = loadImage("images/ground2.png");
    desertImage = loadImage("images/desert.jpg");
    foggyImage = loadImage("images/foggy.jpg");
    pebbleImage = loadImage("images/pebble.jpg");

    gameOverImage = loadImage("images/gameOver.png");
    restartImage = loadImage("images/restart.png");

}

function setup() {
  createCanvas(600,200 );

    trex = createSprite(50, 150, 20, 20)
    trex.addAnimation("running", trexRunning);
    trex.addImage("collided", trexEnd);
    trex.scale = 0.5;
    trex.setCollider("circle",0,0,50);
    trex.debug = false;

    ground = createSprite(300, 165 , 600, 20);
    ground.addImage("ground", groundImage);
    ground.x = ground.width/2;
    ground.velocityX = -5;
    
    invisGround = createSprite(300,178,600,10);
    invisGround.visible = false;

    gameOver = createSprite(camera.x/2, 60);
    gameOver.addImage(gameOverImage);
    gameOver.visible = false;
    gameOver.scale = 0.5;

    
    restart = createSprite(camera.x/2, 100);
    restart.addImage(restartImage);
    restart.visible = false;
    restart.scale = 0.5;

    score = 0;

    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    
}
 


function draw() {
  background("grey");
  image(foggyImage, -250, 0, 600,200)
  
  camera.x = trex.x;
  
  text("Score: "+ score, 200, 50)

  if(gameState === PLAY){

    score = score + Math.round(getFrameRate()/55);
    if(keyDown("space")&&trex.y>140){
      trex.velocityY = -14;
    }
    trex.velocityY = trex.velocityY +0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    trex.collide(invisGround);
    spawnObstacles();
    spawnClouds();

    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }

  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    console.log("hello");
    trex.changeAnimation("collided", trexEnd)

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }  

  }



  drawSprites();
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,150,10,40);
    obstacle.velocityX = -4;

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 600;
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if(frameCount % 60 === 0){
    var cloud = createSprite(600, 100, 40, 10)
    cloud.y = Math.round(random(60,100));
    cloud.addImage(cloudImage);
    cloud.scale= 0.5;
    cloud.velocityX = -3;

    cloud.lifetime=600;

    cloud.depth = trex.depth
    trex.depth = trex.depth+1;

    cloudsGroup.add(cloud)
  }
}

function reset(){ 
  gameState = PLAY;
  ground.x = -50
  draw();
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trexRunning);
  score = 0; 
}