if (!common) var common = {}
/*
弹出层
example:common.alert.create({ type: "container" });
*/
common.alert = {
    cover : {
        width:630,
        height: 280,
        sureText: "确认",
        cancelText: "取消",
        type: "container",
        control: "<div></div>",
        close: function () { },
        sure: function () { },
        cancel: function () { },
        loaded: function () { },
        iframeLoaded: function () { },
        onresize:function(){},
        showClose:true,
        url:null
    },
    alertType: [],
    setDeafaultCover: function () {
        this.cover = {
            width: 630,
            height: 280,
            sureText: "确认",
            cancelText: "取消",
            type: "container",
            control: "<div></div>",
            close: function () { },
            sure: function () { },
            cancel:function(){ },
            loaded: function () { },
            iframeLoaded: function () { },
            onresize: function () { },
            showClose: true,
            url: null
        }
    },
    //判断是否点击中该元素
    isArea: function ($t, NowMousePosition) {
        var offset = $t.offset();
        var end = { left: $t.width() + offset.left, top: $t.height() + offset.top };
        if (NowMousePosition[0] < offset.left || NowMousePosition[1] < offset.top) {
            return false;
        }
        if (NowMousePosition[0] > end.left || NowMousePosition[1] > end.top) {
            return false;
        }
        return true;
    }
}
//创建元素,函数调用处
common.alert.create = function (o,callback) {
    var o = $.extend(true,this.cover, o);
    var alertType = this.alertType[o.type];
    if (!alertType) return;
    
    var a = new elastic(o);
    this.setDeafaultCover();
    if (callback) callback();
    return a;
}
//注册类型
common.alert.register = function(type,elasticType){
    //绑定赋予可操作的类型
    this.alertType[type] = elasticType;
}

var elastic = function(o) {
    this.o = o;
    this.init();
    this[o.type]();
    //添加公共事件
    this.event();
    if (typeof this.o.loaded == "function") this.o.loaded();
}

elastic.prototype.init = function () {
    var self = this;
    //数据
    if (typeof self.o.width == "string") {
        var arr = self.o.width.match(/\d+/g);
        if (arr) {
            self.o.width = arr[0]
        }
    }
    if (typeof self.o.height == "string") {
        var arr = self.o.height.match(/\d+/g);
        if (arr) {
            self.o.height = arr[0]
        }
    }
    //生成公共背景
    self.$elasticContent = $("<div class='com-elastic' style='display:none;'></div>");
    $("body").append(self.$elasticContent);
    self.$elasticContent.width($(window).width()).height($(window).height());
    
    
}
elastic.prototype.event = function () {
    var self = this;
    /*self.$elasticContent.unbind("click").click(function (e) {
    //AddMouseUpFunc("mouseUp_iframeContainer", function (e) {
        
        //点击无效区域 关闭
        if (!common.alert.isArea(self.$content, NowMousePosition)) {
            self.close();
            var e = e || window.event;
            e.stopPropagation();
        }
    });*/
    this.$close.unbind("click").click(function (e) {
        self.close();
        var e = e || window.event;
        e.stopPropagation();
    });
}
elastic.prototype.onresize = function () {
    var self = this;
    var allTop = $(window).height()/2 + $(window.document).scrollTop();
    var allLeft = $(window).width()/2 + $(window.document).scrollLeft();
    if (this.$elasticContent) this.$elasticContent.width($(window).width()).height($(window).height());
    var top = allTop - this.o.height / 2, left = allLeft - this.o.width / 2;
    this.$content.css({ "top": top + "px", "left": left + "px" });
    var closeTop = top - 45 <= 5 ? 5 : top - 45;
    var closeLef = $(window).width() - (left + parseInt(this.o.width) + 15) <= 0 ? $(window).width() - 40 : left + parseInt(this.o.width) + 15;
    this.$close.css({ "top": closeTop + "px", "left": closeLef + "px" });
    if (this.o.showClose) {
        this.$close.show();
    } else {
        this.$close.hide();
    }
}
elastic.prototype.close = function () {
    
    var self = this;
    if (self.o == null) return;
    if (typeof self.o.close == "function") { try { self.o.close(); } catch (e) { } };
   
    if (self.o.oldConfigControl) self.o.oldConfigControl.control[self.o.oldConfigControl.cmd](self.o.control);
    var deleteCur = function () {
        //删除属性
        for (var i in self) {
            
            delete self[i];
        }
        //对象引用解绑
        self = undefined;
        
    }
    var $e = this.$elasticContent;
    $e ? $e.hide(function () {
            $e.remove();
            //退还ID
            if (self.o.oldControlID && self.o.oldControl) {
                self.o.oldControl.attr("id", self.o.oldControlID)
            }
            //如果有标记$blag元素
            if (self.o.$blag) {
                self.o.control.insertAfter(self.o.$blag).hide();
                self.o.$blag.remove();
            }
            deleteCur();
        })
    : deleteCur();
    
    //移除鼠标监听
    removeMURFunc("mouseUp_iframeContainer");
    removeReSizeFunc("reSizeFunc_iframeContainer");
    
}

//普通弹层 
elastic.prototype["container"] = function () {
    var self = this;
    self.o.control = $(self.o.control);
 
    self.o.$blag = $("<div></div>").insertAfter(self.o.control);
    var $back = self.$elasticContent;
    if (self.o.title) {
        var $content = $("<div class='com-content'><div class='com-content-title'><span>" + self.o.title + "</span></div><div class='com-content-control'></div></div>");
    } else {
        var $content = $("<div class='com-content'></div>");
    }
    $back.append($content);
    $content.width(this.o.width).height(this.o.height);

    $content.append(this.o.control);
    self.o.control.show();
    this.$content = $content;
    $back.show();

    this.$close = $("<div class='com-close'></div>");
    $back.append("<div class='clearBoth none'></div>");
    $back.append(this.$close);


    this.onresize();
    AddReSizeFunc("reSizeFunc_iframeContainer", function () {
        self.onresize();
        if (typeof self.o.onresize == "function") self.o.onresize();
    });
}
//移动弹层
elastic.prototype["move"] = function () {
    var self = this;
    self.o.control = $(self.o.control);
    self.o.oldConfigControl = self.o.control.siblings().length > 0 ? self.o.control.prev().length > 0 ?
        function () { return { control: self.o.control.prev(), cmd: "after" } }() :
        function () { return { control: self.o.control.next(), cmd: "before" } }():
        function () { return { control: self.o.control.parent(), cmd: "append" } }();
    var $back = self.$elasticContent;
    var $content = $("<div class='com-content'></div>");
    $back.append($content);
    $content.width(self.o.width).height(self.o.height);
    $content.append(self.o.control);
    this.$content = $content;
    $back.show();
    this.$close = $("<div class='com-close'></div>");
    this.$content.append("<div class='clearBoth none'></div>");
    this.$content.append(this.$close);
    this.onresize();
    AddReSizeFunc("reSizeFunc_iframeContainer", function () {
        self.onresize();
    });
}
//iframe弹层
elastic.prototype["iframeContainer"] = function () {
    var self = this;
    self.o.control = null;
    var addHtml = "<div class='com-contentIframe'></div><div class='com-closeIframe'></div>";
    var $back = self.$elasticContent;
    $back.append(addHtml);
    self.o.control = this.$content = $back.find("div.com-contentIframe").width(self.o.width).height(self.o.height);
    this.$close = $back.find("div.com-closeIframe");
    $back.show();
    
    var $iframe = $("<iframe width='" + self.o.width + "' height='" + self.o.height + "' src='" + self.o.url + "'></iframe>");

    if ($iframe[0].attachEvent) {
        $iframe[0].attachEvent('onload', function () {
            if (self.o.iframeLoaded) self.o.iframeLoaded($iframe[0]);
        });
    } else {
        $iframe[0].onload = function () {
            if (self.o.iframeLoaded) self.o.iframeLoaded($iframe[0]);
        }
    }
    this.$content.append($iframe);
    this.onresize();
    AddReSizeFunc("reSizeFunc_iframeContainer", function () {
        self.onresize();
        if (typeof self.o.onresize == "function") self.o.onresize();
    });
}
//confirm弹层
elastic.prototype["confirm"] = function () {
    var self = this;
    var addHtml = "<div class='com-contentIframe'></div><div class='com-closeIframe'></div>";
    var $back = self.$elasticContent;
    $back.append(addHtml);
    this.$content = $back.find("div.com-contentIframe").width(460).height(205);
    this.$close = $back.find("div.com-closeIframe");
    var messageCheckHtml = "<div class='confirmMessage'><div class='confirmLeftLine'></div><div class='confirmText'>" + (self.o.message || "确认操作?") + "</div>";
    messageCheckHtml += "<div class='btnLine'><div class='confirmMessageCheck'><input type='checkbox' name='ck'/><span>"
        + (self.o.messageCheck || "不再提示") + "</span></div><div class='cancel'>"+self.o.cancelText+"</div><div class='confirm'>"+self.o.sureText+"</div></div></div>";
    this.$content.append(messageCheckHtml);
    $back.show();
    $back.find(".btnLine").find(".confirm").click(function () {
        if (typeof self.o.sure == "function") { try { self.o.sure(self.$content.find('input[name="ck"]')[0].checked); } catch (e) { } };
        self.close();
    });
    $back.find(".btnLine").find(".cancel").click(function () {
        if (typeof self.o.cancel == "function") { try { self.o.cancel(self.$content.find('input[name="ck"]')[0].checked); } catch (e) { } };
        self.close();
    });
    self.$content.find(".confirmMessageCheck").unbind("click").click(function () {
        if (self.$content.find('input[name="ck"]')[0].checked) {
            self.$content.find('input[name="ck"]')[0].checked = false;
        } else {
            self.$content.find('input[name="ck"]')[0].checked = true;
        }
    });
    self.$content.find('input[name="ck"]').unbind("click").click(function (e) {
        e.stopPropagation();
    });
    this.onresize();
    AddReSizeFunc("reSizeFunc_iframeContainer", function () {
        self.onresize();
        if (typeof self.o.onresize == "function") self.o.onresize();
    });
}
//带有checkbox的confirm弹层
elastic.prototype["confirmCheck"] = function () {
    var self = this;
    var addHtml = "<div class='com-contentIframe'></div><div class='com-closeIframe'></div>";
    var $back = self.$elasticContent;
    $back.append(addHtml);
    this.$content = $back.find("div.com-contentIframe").width(460).height(205);
    this.$close = $back.find("div.com-closeIframe");
    var messageCheckHtml = "<div class='confirmMessage'><div class='confirmLeftLine'></div><div class='confirmText'>" + (self.o.message||"确认操作?") + "</div>";
    messageCheckHtml += "<div class='btnLine'><div class='confirmMessageCheck'><input type='checkbox' name='ck'/><span>"
        + (self.o.messageCheck || "不再提示") + "</span></div><div class='cancel'>" + self.o.cancelText + "</div><div class='confirm'>" + self.o.sureText + "</div></div></div>";
    this.$content.append(messageCheckHtml);
    $back.show();
    $back.find(".btnLine").find(".confirm").click(function () {
        if (typeof self.o.sure == "function") { try { self.o.sure(self.$content.find('input[name="ck"]')[0].checked); } catch (e) { } };
        self.close();
    });
    $back.find(".btnLine").find(".cancel").click(function () {
        if (typeof self.o.cancel == "function") { try { self.o.cancel(self.$content.find('input[name="ck"]')[0].checked); } catch (e) { } };
        self.close();
    });
    self.$content.find(".confirmMessageCheck").unbind("click").click(function () {
        if (self.$content.find('input[name="ck"]')[0].checked) {
            self.$content.find('input[name="ck"]')[0].checked = false;
        } else {
            self.$content.find('input[name="ck"]')[0].checked = true;
        }
    });
    self.$content.find('input[name="ck"]').unbind("click").click(function (e) {
        e.stopPropagation();
    });
    this.onresize();
    AddReSizeFunc("reSizeFunc_iframeContainer", function () {
        self.onresize();
        if (typeof self.o.onresize == "function") self.o.onresize();
    });
}
common.alert.register("container", "container");
common.alert.register("move", "move");
common.alert.register("iframeContainer", "iframeContainer");
common.alert.register("confirm", "confirm");
common.alert.register("confirmCheck", "confirmCheck");