var result = getContext();
var ctx = result.ctx;
var canvas = result.canvas;
var size = 50;
var tangram = [
    {
        p: [
            {
                x: 0,
                y: 0
            }, {
                x: size*8,
                y: 0
            }, {
                x: size*4,
                y: size*4  
            }
        ],
        color: "#caff67"
    },
    {
        p: [
            {
                x: 0,
                y: 0
            }, {
                x: size*4,
                y: size*4,
            }, {
                x: 0,
                y: size*8  
            }
        ],
        color: "#67becf"
    },
    {
        p: [
            {
                x: size*8 ,
                y: 0
            }, {
                x: size*8 ,
                y: size*4,
            }, {
                x: size*6,
                y: size*6  
            }, {
                x: size*6,
                y: size*2  
            }
        ],
        color: "#ef3d61"
    },
    {
        p: [
            {
                x: size*6 ,
                y: size*2
            },{
                x: size*6,
                y: size*6  
            }, {
                x: size*4,
                y: size*4  
            }
        ],
        color: "#f9f51a"
    },
    {
        p: [
            {
                x: size*4 ,
                y: size*4
            }, {
                x: size*6 ,
                y: size*6,
            }, {
                x: size*4,
                y: size*8  
            }, {
                x: size*2,
                y: size*6  
            }
        ],
        color: "#a594c0"
    },
    {
        p: [
            {
                x: size*2 ,
                y: size*6
            },{
                x: size*4,
                y: size*8  
            }, {
                x: 0,
                y: size*8  
            }
        ],
        color: "#fa8ecc"
    },
    {
        p: [
            {
                x: size*8 ,
                y: size*4
            },{
                x: size*8,
                y: size*8  
            }, {
                x: size*4,
                y: size*8  
            }
        ],
        color: "#f6ca29"
    }
];



function draw(item){
    ctx.beginPath();
    ctx.moveTo(item.p[0].x,item.p[0].y);
    for(let i=1;i<item.p.length;i++){
        ctx.lineTo(item.p[i].x,item.p[i].y);
    }
    ctx.closePath();
    ctx.fillStyle=item.color;
    ctx.fill();
};

$(function(){

    tangram.forEach(item => {
        draw(item);
    });
})
