// 主程序
function App() {
    var ctx,
        canvas,
        container,
        canvasbg,
        ctxbg,
        anectrl,
        fruitctrl,
        lastTime,mom,mx,my,baby;

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        var now=Date.now();
        var stime=now-lastTime;
        lastTime=now;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctxbg.clearRect(0,0,canvas.width,canvas.height);
        drawBackground();
        anectrl.drawAll();
        fruitctrl.eatTest(mom.fx,mom.fy);
        fruitctrl.drawAll(stime);
        
        mom.angle=Math.atan2(
            my-mom.fy,
            mx-mom.fx
        )+Math.PI;
        mom.fx=Tools.lerpDistance(mx,mom.fx,0.98);
        mom.fy=Tools.lerpDistance(my,mom.fy,0.98);
        mom.draw(stime);

        baby.angle=Math.atan2(
            mom.fy-baby.fy,
            mom.fx-baby.fx
        )+Math.PI;
        baby.fx=Tools.lerpDistance(mom.fx,baby.fx,0.98);
        baby.fy=Tools.lerpDistance(mom.fy,baby.fy,0.98);
        baby.draw(stime);
    };
    
    function drawBackground() {
        var bg = new Image();
        bg.src = "./img/bg.jpg";
        ctxbg.drawImage(bg, 0, 0, canvasbg.width, canvasbg.height);
    }
    function mouseMove(ev){
        mx=ev.offsetX ;
        my=ev.offsetY;
    }

    
    return {
        init: () => {
            var result = window.getContext();
            ctx = result.ctx;
            canvas = result.canvas;
            $(canvas).on("mousemove",mouseMove);
            // 初始化背景
            container = document.getElementById("canvas-container");
            canvasbg = document.createElement("canvas");
            canvasbg.width = canvas.width;
            canvasbg.height = canvas.height;
            $(canvasbg).css({position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: "0"});
            container.appendChild(canvasbg);
            ctxbg = canvasbg.getContext("2d");
            
            anectrl = new aneClass(ctxbg, canvasbg.width, canvasbg.height);
            anectrl.init();
            fruitctrl=new fruitClass(ctx,anectrl.anes);
            fruitctrl.init();
            lastTime=Date.now();
            mom=new fishObject(ctx);
            mom.init(50);
            baby=new fishObject(ctx);
            baby.init(30);
            mx=0;
            my=0;
            gameLoop();
        }
    }
}
var Tools={
        callLen:(x1,y1,x2,y2)=>{
        
            return Math.pow(x1-x2,2)+Math.pow(y1-y2,2);
        },
        lerpDistance:(a,c,r)=>{
            var de =c-a;
            return a+de*r;
        }
};
//海藻
function aneClass(ctx, bw, bh) {
    var aneCount = 50,
        anes = [];
    function aneObj(i = 0) {
        var x = bw / aneCount * i + Math.random() * 20;
        var ch = bh;
        var h = Math.random() * 25 + 150;
        var w = Math.random() * 10 + 15;
        function draw() {
            ctx.beginPath();
            ctx.moveTo(x, ch);
            ctx.lineTo(x, ch - h);
            ctx.lineWidth = w;
            ctx.stroke();
        }
        return {draw: draw,x,h,w};
    }
    return {
        anes: anes,
        init: () => {
            for (let i = 0; i < aneCount; i++) {
                let o = new aneObj(i);
                anes.push(o);
            }
        },
        drawAll: () => {

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = "#3b154e";
            ctx.lineCap = "round";

            anes.forEach(o => {
                o.draw();
            });
            ctx.restore();
        }
    }
}
// 食物
function fruitClass(ctx,anes){
    var count=30,fruits=[],lives=15;
    var cvs=ctx.canvas;

    function fruitObj() {
        var w,r,speed,c1,c2;
        this.x=0;
        this.y=0;
        function draw(stime) {
            if(!this.live){
                return;
            }
            if(w<r){
                w=w+speed*stime;
                w=w<r?w:r;
            }else{
                this.y=this.y-speed*stime;
            }
            if(this.y<-r){
                this.ane.selected=false;
                this.live=false;
            }
            ctx.beginPath();
            ctx.arc(this.x,this.y,w,0,2*Math.PI);
            var my_gradient=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,w);
            my_gradient.addColorStop(0,c1);
            my_gradient.addColorStop(1,c2);
            ctx.fillStyle=my_gradient;
            ctx.fill();
        }
        function born(ane){
            this.ane=ane;
            this.live = true;
            this.x = ane.x;
            this.y = cvs.height-ane.h;
            w =0 ;
            r=8;
            speed=Math.random()*0.02+0.01;
            this.type= Math.random()*4;
            if(this.type>2){
                c1="#00f";
                c2="rgba(0,0,255,0.2)"
            }else{
                c1="#e87e04";
                c2="rgba(255,255,0,0.2)"
            }
        }
        return {draw,born};
    }
    function init() {
         anes.map(x=>{x.selected=false;});
        for(i=0;i<count;i++){
            var obj=new fruitObj();
            fruits.push(obj);
        }
    }
    function drawAll(stime){
        var fs=fruits.filter(x=>x.live);
        if(fs.length<lives){
            try{
            var nfs=fruits.filter(x=>!x.live);
            var obj= nfs[0];
            var nanes= anes.filter(a=>!a.selected);
            var aidx=Math.floor( Math.random()*nanes.length);
            var ane=nanes[aidx];
            ane.selected=true;
            obj.born(ane);
            }catch(err){
            }
        }
        fruits.forEach(item => {
            item.draw(stime);
        });
    }
    function eatTest(mom_x,mom_y){
        var fs=fruits.filter(x=>x.live);
        fs.forEach(obj => {
            var l= Tools.callLen(obj.x,obj.y,mom_x,mom_y);
            if(l<900){
                obj.live=false;
                obj.ane.selected=false;
            }
        });
    }
    return {
        init,drawAll,eatTest
    }
}
//大鱼
function fishObject(ctx){
    var eye,body,tail,scolor,fcolor,size;
    this.fx=0;
    this.fy=0;
    this.angle=0;
    function eyeObject(){
        this.x=-size/4;
        var timer=0;
        var splite=280;
        this.draw=(stime)=>{
            timer+=stime;
            ctx.beginPath();
            if(timer<splite){
                ctx.arc(this.x,0,size/10,0,2*Math.PI);
            }else{
                ctx.rect(this.x-size/10,-size/20,size/10,3);
                if(timer>splite*2){
                    timer=0;
                }
            }
            ctx.closePath()
            ctx.fillStyle=scolor;
            ctx.fill();
        };
    }
    function bodyObject(){
        this.x=0;
        this.y=size/4;
        this.r=size/4;
        this.d=0.35;
        var timer=0;
        var anm = 0;
        this.draw=(stime)=>{
            ctx.beginPath();
            ctx.moveTo(-size*(1-this.d),0);
            ctx.lineTo(0,-size/2);
            ctx.arc(0,-this.y,this.r,1.5*Math.PI,this.d*Math.PI);
            ctx.arc(0,this.y,this.r,(2-0.35)*Math.PI,0.5*Math.PI);
            ctx.strokeStyle=scolor;
            ctx.closePath()
            ctx.stroke();
        };
    }
    function tailObject(){
        this.x=-size/5;
        this.y=0;
        this.r=size/4;
        var timer=0;
        var anm = 0;
        var splite=50;
        this.draw=(stime)=>{
            timer+=stime;
            if(timer>splite){
                anm=(anm+1)%8;
                timer=timer%splite;
            }
            ctx.strokeStyle=scolor;
            ctx.beginPath();
            ctx.arc(this.x+this.r,this.y,this.r,1.75*Math.PI,0.25*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x+this.r*2,this.y);
            
            ctx.arc(this.x+this.r*(anm*0.03+1.6),this.y,this.r,1.65*Math.PI,0.35*Math.PI);
            ctx.closePath();
            ctx.fillStyle=scolor;
            ctx.fill();
            //ctx.fill();
        };
    }
    this.init=function(s=50){
        size=s;
        scolor="white";
        fcolor="rgba(0,0,0,0)";
        this.fx=ctx.canvas.width/2;
        this.fy=ctx.canvas.height/2;
        eye=new eyeObject();
        body=new bodyObject();
        tail=new tailObject();
    };
    this.draw=function(stime){
        ctx.save();
        ctx.translate(
            this.fx+size/4,
            this.fy);
        ctx.rotate(this.angle);
        eye.draw(stime);
        body.draw(stime);
        tail.draw(stime);
        ctx.restore();
    };
}

var myapp = new App();
myapp.init();