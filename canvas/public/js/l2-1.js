// 主程序
function App() {
    var ctx,
        canvas,
        container,
        canvasbg,
        ctxbg,
        anectrl,
        fruitctrl,
        lastTime,mom,mx,my,baby,score,dust,links=[{
            name:"HTML5小游戏---爱心鱼（上）",
            link:"https://www.imooc.com/learn/515",
        },{
            name:"HTML5小游戏---爱心鱼（下）",
            link:"https://www.imooc.com/learn/516"
        }],linkhtml;

    function gameLoop() {
        if(location.hash!="#l2-1"){
            canvasbg.remove();
            linkhtml.remove();
            return;
        }
        window.requestAnimationFrame(gameLoop);
        var now=Date.now();
        var stime=now-lastTime;
        lastTime=now;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctxbg.clearRect(0,0,canvas.width,canvas.height);

        
        
        mom.angle=Math.atan2(
            my-mom.fy,
            mx-mom.fx
        )+Math.PI;
        mom.fx=Tools.lerpDistance(mx,mom.fx,0.98);
        mom.fy=Tools.lerpDistance(my,mom.fy,0.98);

        baby.angle=Math.atan2(
            mom.fy-baby.fy,
            mom.fx-baby.fx
        )+Math.PI;
        baby.fx=Tools.lerpDistance(mom.fx,baby.fx,0.98);
        baby.fy=Tools.lerpDistance(mom.fy,baby.fy,0.98);


        var bdata= baby.getBodySteps();
        drawBackground();
        if(bdata.count<=0){
            score.drawover(stime);
        }else{
            var fruitobj= fruitctrl.eatTest(mom.fx,mom.fy);
            if(fruitobj){
                mom.eatfruit(fruitobj);
                mom.wavesAppend();
            }
            if(Tools.callLen(mom.fx,mom.fy,baby.fx,baby.fy)<900){
                var fd= mom.getfruitdata();
                if(score.update(fd)){
                    baby.wavesAppend();
                    baby.restore();
                    mom.restore();
                }
            }
            mom.draw(stime);
            baby.draw(stime);
        }
        score.draw();
        fruitctrl.drawAll(stime);
        anectrl.drawAll(stime);
        dust.drawAll(stime);
    
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

    function gameStart(ev){
        var bdata= baby.getBodySteps();
        if(bdata.count>0){
            return;
        }
        if(!score.overClick(ev)){
            return;
        }
        mom.init(50);
        baby.init(30);
        score.init();
    }
    function addLinks(){
        $(container).after(
            links.map(x=>{
                return `<div class='fishlnks'><a href='${x.link}' target='_blank'>${x.name}</a></div>`
            })
        );
        linkhtml=$(".fishlnks");
    };
    return {
        init: () => {
            var result = window.getContext();
            ctx = result.ctx;
            canvas = result.canvas;
            $(canvas).on("mousemove",mouseMove);
            $(canvas).on("click",gameStart);
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
            baby=new fishObject(ctx);
            mom.init(50);
            baby.init(30);
            mx=0;
            my=0;
            score=new scoreData(ctx);
            score.init();
            dust=new dustClass(ctx);
            dust.init();
            addLinks();
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
        },
        isCollision(x1, y1, x2, y2, w, h) {  
            return x1 >= x2 && x1 <= x2 + w && y1 >= y2 && y1 <= y2 + h;  
        }  
};
//海藻
function aneClass(ctx, bw, bh) {
    var aneCount = 50,
        anes = [];
    function aneObj(i = 0) {
        var x = bw / aneCount * i + Math.random() * 20;
        var ch = bh;
        var h = Math.random() * 25 + 180;
        var w = Math.random() * 10 + 15;
        var amp=Math.random() * 50 + 50;
        var topx=x;
        var alpha=0;
        var tx=0;
        function draw(stime) {
            alpha+=stime*0.001;
            var l=Math.sin(alpha);
            tx=topx+l*amp;
            ctx.beginPath();
            ctx.moveTo(x, ch);

            ctx.quadraticCurveTo(x,ch-100,tx,ch-h);
            //ctx.lineTo(x, ch - h);
            ctx.lineWidth = w;
            ctx.stroke();
        }
        function getTx(){
            return tx;
        }
        return {draw: draw,x,h,w,getTx:getTx};
    }
    return {
        anes: anes,
        init: () => {
            for (let i = 0; i < aneCount; i++) {
                let o = new aneObj(i);
                anes.push(o);
            }
        },
        drawAll: (stime) => {

            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = "#3b154e";
            ctx.lineCap = "round";

            anes.forEach(o => {
                o.draw(stime);
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
                w=w+speed*stime*0.2;
                w=w<r?w:r;
            }else{
                this.y=this.y-speed*stime;
            }
            if(this.y<-r){
                this.ane.selected=false;
                this.live=false;
            }
            ctx.beginPath();
            this.x=this.ane.getTx();
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
            this.type= Math.random()*5>3;
            if(this.type){
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
        var fruit=null;
        fs.forEach(obj => {
            var l= Tools.callLen(obj.x,obj.y,mom_x,mom_y);
            if(l<900){
                obj.live=false;
                obj.ane.selected=false;
                fruit=obj;
            }
        });
        return fruit;
    }
    return {
        init,drawAll,eatTest
    }
}
//画鱼
function fishObject(ctx){
    var eye,body,tail,wavelist,scolor,fcolor,size;
    this.fx=0;
    this.fy=0;
    this.angle=0;
    var bodySteps={
        count:20,
        alpha:0,
        light:0,
        hue:0
    };
    var fruitdata={
        blue:0,
        orange:0
    };
    function eyeObject(){
        this.x=-size/4;
        var timer=0;
        var splite=1800;
        this.draw=(stime)=>{
            timer+=stime;
            ctx.beginPath();
            if(timer<splite){
                ctx.arc(this.x,0,size/10,0,2*Math.PI);
            }else{
                ctx.rect(this.x-size/10,-size/20,size/10,3);
                if(timer>splite*1.2){
                    timer=0;
                    splite=Math.random()*800+800;
                }
            }
            ctx.closePath()
            ctx.fillStyle="#fff";
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
        var splite=400;

        this.draw=(stime)=>{
            ctx.beginPath();
            ctx.moveTo(-size*(1-this.d),0);
            ctx.lineTo(0,-size/2);
            ctx.arc(0,-this.y,this.r,1.5*Math.PI,this.d*Math.PI);
            ctx.arc(0,this.y,this.r,(2-0.35)*Math.PI,0.5*Math.PI);
            timer+=stime;
            //小鱼
            if(size<50){
                if(timer>splite){
                    timer=0;
                    bodySteps.count--;
                    fcolor[2] += bodySteps.light;
                    fcolor[3] -=  bodySteps.alpha;
                }
                var my_gradient=ctx.createRadialGradient(this.x-size/5,0,0,this.x-size/5,0,size/1.5);
                var fc=`hsla(${fcolor[0]},${fcolor[1]}%,${fcolor[2]}%,${fcolor[3]})`
                my_gradient.addColorStop(1,fc);
                my_gradient.addColorStop(0,scolor);
                ctx.fillStyle=my_gradient;
                ctx.fill();
            }
            //大鱼
            else{
                if(fruitdata.blue>0){
                    scolor="#00f";
                    fcolor[0]=210;
                    fcolor[2] = bodySteps.light*fruitdata.blue;
                    fcolor[3] =  bodySteps.alpha*fruitdata.blue;
                }else if(fruitdata.orange>0){
                    scolor="#f80";
                    fcolor[0]=30;
                    fcolor[2] = bodySteps.light*fruitdata.orange;
                    fcolor[3] =  bodySteps.alpha*fruitdata.orange;
                }
                fcolor[3]=fcolor[3]>1?1:fcolor[3];
                fcolor[2]=fcolor[2]>50?50:fcolor[2];
                if(fruitdata.blue+fruitdata.orange>0){
                    var my_gradient=ctx.createRadialGradient(this.x-size/5,0,0,this.x-size/5,0,size/1.5);
                    var fc=`hsla(${fcolor[0]},${fcolor[1]}%,${fcolor[2]}%,${fcolor[3]})`
                    my_gradient.addColorStop(0,scolor);
                    my_gradient.addColorStop(1,fc);
                    ctx.fillStyle=my_gradient;
                    ctx.fill();
                }
            }
            ctx.strokeStyle="#fff";
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
            ctx.strokeStyle="#fff";
            ctx.beginPath();
            ctx.arc(this.x+this.r,this.y,this.r,1.75*Math.PI,0.25*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x+this.r*2,this.y);
            
            ctx.arc(this.x+this.r*(anm*0.03+1.6),this.y,this.r,1.65*Math.PI,0.35*Math.PI);
            ctx.closePath();
            ctx.fillStyle="#fff";
            ctx.fill();
            //ctx.fill();
        };
    }
    function waveObject(){
        var waves=[],max=100;
        this.append=function(x,y){
            waves.push({
                x:x,
                y:y,
                r:0
            });
        };
        this.draw=function(stime){
            
            ctx.save();
            waves.forEach(item => {
                ctx.beginPath();
                var alpha=(100-item.r)/100;
                
                ctx.strokeStyle=size<50?`rgba(255,200,0,${alpha})`:`rgba(255,255,255,${alpha})`;
                item.r+=stime*0.07;
                ctx.arc(item.x,item.y,item.r,0,2*Math.PI);
                ctx.closePath();
                ctx.stroke();
            });
            ctx.restore();
            waves=waves.filter(x=>x.r<max);
        };
    }
    this.init=function(s=50){
        size=s;
        scolor="white";
        fcolor=[0,100,50,1];
        bodySteps.count=size<50?20:10;

        bodySteps.light=fcolor[2]/bodySteps.count;
        bodySteps.alpha=1/bodySteps.count;

        this.fx=ctx.canvas.width/2;
        this.fy=ctx.canvas.height/2;
        eye=new eyeObject();
        body=new bodyObject();
        tail=new tailObject();
        wavelist=new waveObject();
    };
    this.draw=function(stime){
        ctx.fillStyle="white";
        ctx.font="14px Verdana";
        ctx.textAlign="left";
        if(size>=50){
            ctx.fillText("blue(10): " +fruitdata.blue, 20,50);        
            ctx.fillText("orange(5): " +fruitdata.orange, 20,70);    
        }else{
            ctx.fillText("life: " +bodySteps.count, 20,90);    
        }
        wavelist.draw(stime);
        //画吃的东西
        ctx.save();
        ctx.translate(
            this.fx+size/4,
            this.fy);
        ctx.rotate(this.angle);
        body.draw(stime);
        eye.draw(stime);
        tail.draw(stime);
        ctx.restore();
    };
    this.getfruitdata=function(){
        return fruitdata;
    };
    this.getBodySteps=function(){
        return bodySteps;
    };
    this.restore=function(){
        bodySteps.count=20; 
        fcolor[2]=50;
        fcolor[3]=1;
        fruitdata.orange=0;
        fruitdata.blue=0;
    }
    this.wavesAppend=function(){
        wavelist.append(this.fx,this.fy);
    };
    this.eatfruit=function(fruit){
        if(fruit.type){
            fruitdata.blue++;
        }else{
            fruitdata.orange++;
        }
    }
}
//记录
function scoreData(ctx){
    this.score=0;
    
    this.init=function(){
        this.score=0;
    };
    var canvas=ctx.canvas,alpha=0;
    this.update=function(data){
        this.score+=data.blue*10+data.orange*5;
        if(data.blue+data.orange>0){
            return true;
        }else{
            return false;
        }
    };
    this.draw=function(){
        ctx.fillStyle="white";
        ctx.font="20px Verdana";
        ctx.textAlign="center";
        ctx.fillText("score: " + this.score,canvas.width*0.5,50);
    };
    this.drawover=function(stime){
        alpha+=stime*0.0005;
        if(alpha>1){
            alpha=1;
        }
        ctx.save();
        ctx.shadowBlur=10;
        ctx.shadowColor="#ff0";
        ctx.fillStyle=`rgba(255,255,255,${alpha})`;
        ctx.font="30px Verdana";
        ctx.textAlign="center";
        ctx.fillText("game over ",canvas.width*0.5,canvas.height*0.5);
        ctx.restore();
    };
    this.overClick=function(ev){
        var left=canvas.width*0.5-100;
        var top=canvas.height*0.5-15;
        return Tools.isCollision(ev.offsetX,ev.offsetY,left,top,200,30);
    };
}
function dustClass(ctx){
    var dusts=[],max=30;
    var cw=ctx.canvas.width;
    var ch=ctx.canvas.height;
    var alpha=0;
    this.init=function(){
        for(var i=0;i<max;i++){
            dusts.push({
                x:Math.random()*cw,
                y:Math.random()*ch,
                r:Math.random()*4+3,
                a:Math.random()*0.4+0.1,
                amp:Math.random() * 50 + 50
            });
        }
    };
    this.drawAll=function(stime){
        alpha+=stime*0.001;
        var l=Math.sin(alpha);
        dusts.forEach(item=>{
            ctx.save();
            ctx.beginPath();
            var tx=item.x+l*item.amp;

            ctx.arc(tx,item.y,item.r,0,2*Math.PI);
            var my_gradient=ctx.createRadialGradient(tx,item.y,0,tx,item.y,item.r);
            my_gradient.addColorStop(0,`rgba(255,255,255,${item.a})`);
            my_gradient.addColorStop(1,`rgba(255,255,255,0)`);
            ctx.fillStyle=my_gradient;
            ctx.fill();
            ctx.restore();
        });
    };
}
var myapp = new App();
myapp.init();