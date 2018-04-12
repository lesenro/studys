var result = getContext();
var ctx = result.ctx;
var canvas = result.canvas;

var stage = new createjs.Stage(canvas);
 var image = new createjs.Bitmap("img/bg.jpg");
 stage.addChild(image);
 
 createjs.Ticker.addEventListener("tick", handleTick);
 function handleTick(event) {
     image.x += 10;
     stage.update();
 }