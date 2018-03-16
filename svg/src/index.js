const routers = [
    {
        name: "基本",
        menus: [
            {
                name: "开始学习",
                key: "#default",
                url: "svgs/default.svg"
            }, {
                name: "一个笑脸",
                key: "#l1-1",
                url: "svgs/l1-1.svg"
            }
        ]
    }, {
        name: "SVG动画",
        menus: [
            {
                name: "动画原理",
                key: "#l7-1",
                url: "svgs/l7-1.svg"
            }
        ]
    }
];
$(function () {
    $("#fullscreen").hide();
    //初始化代码编辑器
    window.editor = CodeMirror.fromTextArea($("#code").get(0), {
        mode: "text/html",
        lineNumbers: true
    });
    //修改代码编辑器
    editor.on("change", function () {
        $("#svg").html(editor.getValue());
    });
    //初始化左边菜单
    sidebarInit();
    //点击菜单
    $(".nav-sidebar a").click(function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var key = $(this).attr("data-key");
        var url = $(this).attr("data-url");
        location.hash = key;
        loadSvg(url);
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
                .find(x => x.key === lochash);
            if (tmp) {
                item = tmp;
                return false;
            }
        });
        if (item) {
            loadSvg(item.url);
            $(".nav-sidebar li").removeClass("active");
            $("#mm_" + item.key.replace("#", ""))
                .parent("li")
                .addClass("active");
        } else {

            loadSvg("svgs/default.svg");
        }
    } else {
        loadSvg("svgs/default.svg");
    }
});

function loadSvg(path) {
    if (!path) {
        return;
    }
    var svg = $("#svg");
    $
        .ajax({type: "get", dataType: "xml", url: path})
        .then((x) => {
            var html = x.documentElement;
            svg.html(html);
            var s = new XMLSerializer();
            editor.setValue(s.serializeToString(html))
        });
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
                <a href="#" id="mm_${item.key.replace("#", "")}" data-key="${item.key}" data-url="${item.url}">${item.name}</a>
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
