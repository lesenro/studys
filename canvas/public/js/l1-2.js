var result = getContext();
var ctx = result.ctx;
var canvas = result.canvas;
drawStart(5,100,200,250,250,54);

//pointnum:星星的顶点数，
//r:内圈半径
//R:外圈半径
//x:x轴偏移量
//y:y轴偏移量
//rot:旋转角度
function drawStart(pointnum,r,R,x,y,rot=0){
    var angle=360/pointnum;
    ctx.beginPath();
    for(var i=0;i<pointnum;i++){
        var sx_1=Math.cos((i*angle-rot)/180*Math.PI)*R+x;
        var sy_1=-Math.sin((i*angle-rot)/180*Math.PI)*R+y;
        var sx_2=Math.cos((i*angle-rot+angle/2)/180*Math.PI)*r+x;
        var sy_2=-Math.sin((i*angle-rot+angle/2)/180*Math.PI)*r+y;
        ctx.lineTo(sx_1,sy_1);
        ctx.lineTo(sx_2,sy_2);
    }
    ctx.closePath();
    ctx.stroke();
}