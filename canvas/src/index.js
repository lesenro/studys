const routers = [
    {
        name: "基本",
        menus: [
            {
                name: "开始学习",
                key: "default",
                url: "js/default.js"
            }, {
                name: "七巧板",
                key: "l1-1",
                url: "js/l1-1.js"
            }, {
                name: "画星星",
                key: "l1-2",
                url: "js/l1-2.js"
            }
        ]
    }, {
        name: "游戏动画",
        menus: [
             {
                name: "小鱼游戏",
                key: "l2-1",
                url: "js/l2-1.js"
            }
        ]
    },{
        name:"three.js",
        menus:[
            {
                name:"开始",
                key:"l3-1",
                url:"js/l3-1.js",
                html:"tmpl/l3-1.html",
            }
        ]
    },{
        name:"create.js",
        menus:[
            {
                name:"开始",
                key:"l4-1",
                url:"js/l4-1.js",
                //html:"tmpl/l3-1.html",
            }
        ]
    }
];
$(function () {
    $("#fullscreen").hide();
    //初始化左边菜单
    sidebarInit();
    //点击菜单
    $(".nav-sidebar a").click(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        $("canvas").remove();
        var key = $(this).attr("data-key");
        loadPage(key);
    });
    //预览全屏
    $("#btn-fullscreen").click(function (ev) {
        $("#fullscreen .svg").html($("#svg").html());
        $("#fullscreen").show(200);
    });
    //预览全屏
    $("#btn-close-fullscreen").click(function (ev) {
        $("#fullscreen").hide(200);
    });
    //根据url中的hash值确定显示内容
    var lochash = location.hash;
    $("#sidebar ul.nav:eq(0) li:eq(0)").addClass("active");

    if (lochash) {
        loadPage(lochash.replace("#",""));
    } else {
        loadPage("default")
    }
});
function loadPage(key){
    var htmlCnt=$("#html-container").hide();
    var canvasCnt=$("#canvas-container");
    var allmenus= [].concat(...routers.map(x=>x.menus));

    htmlCnt.hide();
    canvasCnt.hide();

    location.hash = "#"+key;

    $(".nav-sidebar li").removeClass("active");
    $("#mm_"+key).parent("li").addClass("active")
    var m=allmenus.find(x=>x.key==key);
    if(!m){
        return;
    }
    if(m.loads){
        m.loads.forEach(x=>{
            if(x.type=="js"){
                loadJs(x.url);                
            }
        });
    }
    if(m.html){
        htmlCnt.show();
        $.get(m.html).then(res=>{
            htmlCnt.html(res);
        });
        loadJs(m.url);
    }else{
        canvasCnt.show();
        loadJs(m.url);
    }
}
function loadJs(url){
    var js=$.getScript(url).then(js=>{
    });
}
window.getContext=function(){
    
    var container = document.getElementById("canvas-container");
    var canvas = document.createElement("canvas");
    canvas.id="canvas";
    container.appendChild(canvas);
    canvas.width=800;
    canvas.height=600;
    var ctx= canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    return {canvas,ctx};
}
function sidebarInit() {
    var html = [];
    routers.forEach(x => {
        var subhtml = [];
        x
            .menus
            .forEach(item => {
                subhtml.push(`
            <li>
                <a href="#" id="mm_${item.key}" data-key="${item.key}" data-url="${item.url}">${item.name}</a>
            </li>
          `);
            });
        html.push(`
            <h3>${x.name}</h3>
            <ul class="nav nav-sidebar">
            ${subhtml.join("")}
            </ul>
        `);
    });
    $("#sidebar").html(html.join(""));
}


