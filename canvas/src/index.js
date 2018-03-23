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
            }
        ]
    }, {
        name: "SVG动画",
        menus: [
            {
                name: "动画原理",
                key: "l7-1",
                url: "js/l7-1.js"
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

        var key = $(this).attr("data-key");
        var url = $(this).attr("data-url");
        location.hash = "#"+key;
        loadJs(url);
        $(".nav-sidebar li").removeClass("active");
        $(this)
            .parent("li")
            .addClass("active");
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
        var item = null;
        routers.forEach(m => {
            var tmp = m
                .menus
                .find(x => "#"+x.key === lochash);
            if (tmp) {
                item = tmp;
                return false;
            }
        });
        if (item) {
            loadJs(item.url);
            $(".nav-sidebar li").removeClass("active");
            $("#mm_" + item.key)
                .parent("li")
                .addClass("active");
        } else {

            loadJs("js/default.js");
        }
    } else {
        location.hash = "default";
    }
});

function loadJs(url){
    $.getScript(url).then(js=>{
    });
}
window.getContext=function(){
    var canvas=document.getElementById("canvas");
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


