/*
*鼠标控制器，廖力编写@2012
*/

//页面载入
$(document).ready(function () {
    //获取鼠标的上个测点
    FindMouseLastPosition();
    //打印鼠标当前的信息
    printMouseInfo();
});

//当前鼠标所在坐标
var NowMousePosition = [0, 0];

//鼠标的上个测点
var MouseLastTimePosition = [0, 0];

//鼠标的移动速度
var MouseSpeed = [0, 0];

//鼠标的移动方向,上:u,下d,左l,右r,无:n
var MouseMoveDirection = ['n', 'n'];

//鼠标测点的平滑度
var MPointTime = 20;

//[{ 'funcName': 'goodJob', 'Func': function () { alert('aa'); } }, { 'funcName': 'nice', 'Func': function () { alert('bb'); } }];
//鼠标移动的预设方法
var MMReserveFunction = [];


//鼠标左键弹上的预设方法
var MUReserveFunction = [];

//页面大小变化时的预设方法
var PAReserveFunction = [];

//当鼠标移动（任意时候）
$(document).mousemove(function (e) {
    //设置鼠标当前所在坐标
    NowMousePosition = [e.pageX, e.pageY]

    //运行预设方法
    if (MMReserveFunction.length != 0) {
        for (var i = 0; i < MMReserveFunction.length; i++) {
            var functionPro = MMReserveFunction[i];
            functionPro.Func(e);
        }
    }

    //打印鼠标当前的信息
    printMouseInfo();
});

//当鼠标左键弹上时
$(document).mouseup(function (e) {
    //运行预设方法
    if (MUReserveFunction.length != 0) {
        for (var i = 0; i < MUReserveFunction.length; i++) {
            var functionPro = MUReserveFunction[i];
            functionPro.Func(e);
        }
    }
    //alert('td');
});

//当页面大小变化时
$(window).resize(function () {
    //运行预设方法
    
    if (PAReserveFunction.length != 0) {
        for (var i = 0; i < PAReserveFunction.length; i++) {
            var functionPro = PAReserveFunction[i];
            
            functionPro.Func();
        }
    }
});

//向页面大小变化时注册一个事件
function AddReSizeFunc(name, CallBack) {
    PAReserveFunction.push({ 'funcName': name, 'Func': CallBack });
}

//向鼠标移动事件数组中注册一个事件
function AddMouseMoveFunc(name, CallBack) {
    MMReserveFunction.push({ 'funcName': name, 'Func': CallBack });
}

//向鼠标弹起事件数组中注册一个事件
function AddMouseUpFunc(name, CallBack) {
    MUReserveFunction.push({ 'funcName': name, 'Func': CallBack });
}

//移除鼠标移动事件数组中的某个方法
function removeMMRFunc(name) {
    var tempArr = [];
    for (var i = 0; i < MMReserveFunction.length; i++) {
        var functionPro = MMReserveFunction[i];
        if (functionPro.funcName != name) {
            tempArr.push(functionPro);
        }
    }
    MMReserveFunction = [];
    MMReserveFunction = tempArr;
}

//移除鼠标弹起事件数组中的某个方法
function removeMURFunc(name) {
    var tempArr = [];
    for (var i = 0; i < MUReserveFunction.length; i++) {
        var functionPro = MUReserveFunction[i];
        if (functionPro.funcName != name) {
            tempArr.push(functionPro);
        }
    }
    MUReserveFunction = [];
    MUReserveFunction = tempArr;
}

//移除窗口变化事件数组中的某个方法
function removeReSizeFunc(name) {
    var tempArr = [];
    for (var i = 0; i < PAReserveFunction.length; i++) {
        var functionPro = PAReserveFunction[i];
        if (functionPro.funcName != name) {
            tempArr.push(functionPro);
        }
    }
    PAReserveFunction = [];
    PAReserveFunction = tempArr;
}
//获取鼠标的上个测点
function FindMouseLastPosition() {
    //鼠标测点
    TimeMouse();
    //启动测点器，检测鼠标的移动
    var timer = setInterval(function () {
        //鼠标测点
        TimeMouse();
    }, MPointTime);
}

//鼠标测点使用的方法
function TimeMouse() {
    //计算鼠标的X速度
    MouseSpeed[0] = MouseLastTimePosition[0] - NowMousePosition[0];
    //计算鼠标的Y速度
    MouseSpeed[1] = MouseLastTimePosition[1] - NowMousePosition[1];

    //计算鼠标移动方向
    if (MouseSpeed[0] > 0) {
        //如果鼠标X速度大于零视为往左移动
        MouseMoveDirection[0] = 'l';
    }
    if (MouseSpeed[0] < 0) {
        //如果鼠标X速度小于零视为往右移动
        MouseMoveDirection[0] = 'r';
    }
    if (MouseSpeed[0] == 0) {
        //否则就是没有移动方向
        MouseMoveDirection[0] = 'n';
    }

    if (MouseSpeed[1] > 0) {
        //如果鼠标Y速度大于零视为往上移动
        MouseMoveDirection[1] = 'u';
    }
    if (MouseSpeed[1] < 0) {
        //如果鼠标Y速度小于零视为往下移动
        MouseMoveDirection[1] = 'd';
    }
    if (MouseSpeed[1] == 0) {
        //否则就是没有移动方向
        MouseMoveDirection[1] = 'n';
    }

    //在此之前视为上次的移动位置有效
    MouseLastTimePosition = NowMousePosition;
}

//获取移动方向中文
function GetDirectionChinese(D) {
    var chinese = '无';
    switch (D) {
        case 'u':
            chinese = "上";
            break;
        case 'd':
            chinese = "下";
            break;
        case 'l':
            chinese = "左";
            break;
        case 'r':
            chinese = "右";
            break;
    }
    return chinese;
}

//绑定移动层
function BindMouseMoveLayer(ClickId, MoveID) {

    var ClickObj = document.getElementById(ClickId);
    var MoveObj = document.getElementById(MoveID);


    $(ClickObj).unbind('mousedown');
    $(ClickObj).mousedown(function () {
        removeMMRFunc(MoveID + 'MM');
        removeMURFunc(MoveID + 'MU');
        var xl = parseInt(NowMousePosition[0] - parseInt($(MoveObj).css('left').replace('px')));
        var yl = parseInt(NowMousePosition[1] - parseInt($(MoveObj).css('top').replace('px')));
        AddMouseMoveFunc(MoveID + 'MM', function () {
            $(MoveObj).css('left', NowMousePosition[0] - xl + "px");
            $(MoveObj).css('top', NowMousePosition[1] - yl + "px");

        });
        AddMouseUpFunc(MoveID + 'MU', function () {
            if (parseInt($(MoveObj).css('left').replace('px')) < 0) {
                $(MoveObj).css('left', '0px');
            }

            if (parseInt($(MoveObj).css('top').replace('px')) < 0) {
                $(MoveObj).css('top', '0px');
            }

            if (parseInt($(MoveObj).css('left').replace('px')) + $(MoveObj).width() > top.BodyWidth) {
                $(MoveObj).css('left', top.BodyWidth - $(MoveObj).width() + 'px');
            }

            if (parseInt($(MoveObj).css('top').replace('px')) + $(MoveObj).height() > top.FrameHeight) {
                $(MoveObj).css('top', top.FrameHeight - $(MoveObj).height() + 'px');
            }

            removeMMRFunc(MoveID + 'MM');
            removeMURFunc(MoveID + 'MU');
        });
    });
}

//取消绑定移动层
function unBindMouseMoveLayer(ClickId,MoveID) {
    var ClickObj = document.getElementById(ClickId);
    var MoveObj = document.getElementById(MoveID);
    $(ClickObj).unbind('mousedown');
    removeMMRFunc(MoveID + 'MM');
    removeMURFunc(MoveID + 'MU');
}

function printMouseInfo() {
//    //当前鼠标在哪
//    $("#mouseNowPosition").html(NowMousePosition[0]+","+NowMousePosition[1]);
//    //鼠标的移动速度
//    $("#mouseMoveSpeed").html(MouseSpeed[0] + "," + MouseSpeed[1]);
//    //鼠标的移动方向
//    $("#mouseMoveDrect").html(GetDirectionChinese(MouseMoveDirection[0]) + "," + GetDirectionChinese(MouseMoveDirection[1]));
}