var result=getContext();
var ctx=result.ctx;
var canvas=result.canvas;
ctx.font="30px Verdana";
// 创建渐变
var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
gradient.addColorStop("0","blue");
gradient.addColorStop("1.0","red");
// 用渐变填色
ctx.strokeStyle=gradient;


setTimeout(function(){
    var txt="开始学习Canvas";
    var w=ctx.measureText(txt).width;
    ctx.strokeText(txt,(canvas.width-w)/2,90);
},2000);