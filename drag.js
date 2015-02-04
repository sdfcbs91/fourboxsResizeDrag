/**
**²ÎÊý:[{drag,control,type:"s",position:"left_top"}]
**/
var girdResize = function (o) {
    this.setDefault = function () {
        this.sResizeArr = [];
        this.wResizeArr = [];
        this.s_wResizeArr = [];
        this.equalArr = [];
        this.unequalArr = [];
    }
    this.drag = function (o) {
        this.options = o;
        this.setDefault();
        this.event();
    }
    this.event = function () {
        var arr = this.options, self = this;
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i].control) continue;
            if (arr[i].type in self) self[arr[i].type](arr[i]);
        }

    }
    this.s = function (option) {
        var self = this;
        $(option.drag).unbind("mousedown").mousedown(function () {
            var positionKey = option.position.toLowerCase().indexOf("top") > -1 ? "top" : "bottom";
            var siblings = self.getSiblings(option, positionKey);
            self.setStart(option, siblings);
            AddMouseMoveFunc("mouseMove_gridResize", function () {
                self.MoveW(positionKey, option, siblings);
            });
            AddMouseUpFunc("mouseUp_gridResize", function () {
                self.setEnd(option, siblings);
                removeMMRFunc("mouseMove_gridResize");
                removeMURFunc("mouseUp_gridResize");
            });
        });
    }
    this.w = function (option) {
        var self = this;
        $(option.drag).unbind("mousedown").mousedown(function () {
            var positionKey = option.position.toLowerCase().indexOf("left") > -1 ? "left" : "right";
            var siblings = self.getSiblings(option, positionKey);
            self.setStart(option, siblings);
            AddMouseMoveFunc("mouseMove_gridResize", function () {
                self.MoveS(positionKey, option, siblings);
            });
            AddMouseUpFunc("mouseUp_gridResize", function () {
                self.setEnd(option, siblings);
                removeMMRFunc("mouseMove_gridResize");
                removeMURFunc("mouseUp_gridResize");
            });
        });
    }
    this.sw = function (option) {
        var self = this;
        $(option.drag).unbind("mousedown").mousedown(function () {
            var positionKey = {
                x: option.position.toLowerCase().indexOf("left") > -1 ? "left" : "right",
                y: option.position.toLowerCase().indexOf("top") > -1 ? "top" : "bottom"
            }

            var siblings = self.getSiblings(option);
            self.setStart(option, siblings);
            AddMouseMoveFunc("mouseMove_gridResize", function () {
                self.MoveSW(positionKey, option, siblings);
            });
            AddMouseUpFunc("mouseUp_gridResize", function () {
                self.setEnd(option, siblings);
                removeMMRFunc("mouseMove_gridResize");
                removeMURFunc("mouseUp_gridResize");
            });
        });
    }
    this.getSiblings = function (option, positionKey) {
        var arr = this.options, temp = [[], []];
        var equalControl = function (control) {
            for (var n = 0; n < temp.length; n++) {
                for (var m = 0; m < temp[n].length; m++) {

                    if (control[0] === temp[n][m].control[0]) return false;

                }
            }
            return true;
        }
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i].control) continue;
            if (arr[i].control[0] != option.control[0]) {
                if (!equalControl(arr[i].control)) {
                    continue;
                }

                if (positionKey) {
                    if (arr[i].position.toLowerCase().indexOf(positionKey) > -1) {
                        temp[0].push(arr[i]);
                    } else {
                        temp[1].push(arr[i]);
                    }
                } else {
                    temp[1].push(arr[i]);
                }
            }
        }
        return temp;
    }
    this.setStart = function (option, siblings) {
        this.downPoint = { x: NowMousePosition[0], y: NowMousePosition[1], bodyCursor: $("body").css("cursor") };
        option.control.addClass("resizing");
        option.start = { x: option.control.offset().left, y: option.control.offset().top, width: option.control.width(), innerWidth: option.control.innerWidth(), height: option.control.height() }
        this.eachSiblings(siblings, function (sibling, i) {
            sibling.control.addClass("resizing");

            sibling.start = { x: sibling.control.offset().left, y: sibling.control.offset().top, width: sibling.control.width(), innerWidth: sibling.control.innerWidth(), height: sibling.control.height() }
        });
        $("body").css("cursor", option.drag.css("cursor"));
    }
    this.setEnd = function (option, siblings) {
        var self = this;
        option.control.removeClass("resizing");
        this.eachSiblings(siblings, function (sibling, i) {
            sibling.start = null;
            if (sibling.control) sibling.control.removeClass("resizing");
        });
        $("body").css("cursor", this.downPoint.bodyCursor);
        this.downPoint = null;
        option.start = null;
        this.eachFuncEvent(function (evenObj) {
            if (evenObj.event.mouseup) evenObj.event.mouseup(self);
        })
    }
    this.MoveS = function (positionKey, option, siblings) {
        var self = this,
            difference = { x: NowMousePosition[0] - self.downPoint.x };
        if (positionKey === "right") {
            difference.x = -difference.x;
        }
        var x = difference.x;
        option.control.width(option.start.width + x);
        this.eachSiblings(siblings, function (sibling, i) {
            if (i === 0) {
                sibling.control.width(sibling.start.width + x);
            } else {
                sibling.control.width(sibling.start.width - x);
            }
        })
    }
    this.MoveW = function (positionKey, option, siblings) {
        var self = this,
            difference = { y: NowMousePosition[1] - self.downPoint.y };
        if (positionKey === "bottom") {
            difference.y = -difference.y;
        }
        var y = difference.y;
        option.control.height(option.start.height + y);
        this.eachSiblings(siblings, function (sibling, i) {
            if (i === 0) {
                sibling.control.height(sibling.start.height + y);
            } else {
                sibling.control.height(sibling.start.height - y);
            }
        })
    }
    this.MoveSW = function (positionKey, option, siblings) {
        var self = this,
            difference = { x: NowMousePosition[0] - self.downPoint.x, y: NowMousePosition[1] - self.downPoint.y };
        if (positionKey.x === "right") {
            difference.x = -difference.x;
        }
        if (positionKey.y === "bottom") {
            difference.y = -difference.y;
        }

        var x = difference.x, y = difference.y;
        option.control.width(option.start.width + x).height(option.start.height + y);

        this.eachSiblings(siblings, function (sibling, i) {
            var siblingKey = {
                x: sibling.position.toLowerCase().indexOf("left") > -1 ? "left" : "right",
                y: sibling.position.toLowerCase().indexOf("top") > -1 ? "top" : "bottom"
            }
            if (siblingKey.x === positionKey.x) {
                sibling.control.width(sibling.start.width + x).height(sibling.start.height - y);
            } else if (siblingKey.y === positionKey.y) {
                sibling.control.width(sibling.start.width - x).height(sibling.start.height + y);
            } else {
                sibling.control.width(sibling.start.width - x).height(sibling.start.height - y);
            }

        })
    }
    this.eachFuncEvent = function (callback) {
        if (!callback) return;
        var arr = this.options;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].event) {
                callback(arr[i]);
            }
        }
    }
    this.eachSiblings = function (siblings, callback) {
        for (var i = 0; i < siblings.length; i++) {
            for (var j = 0; j < siblings[i].length; j++) {
                callback(siblings[i][j], i);
            }
        }
    }
    this.eachOptions = function (callback) {
        if (!callback) return;
        var arr = this.options;
        for (var i = 0; i < arr.length; i++) {
            var c = callback(arr[i]);
            if (typeof c === "boolean") {
                if (c === false) break;
            }
        }
    }

    this.drag(o);
}