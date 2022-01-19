/**
 * Created by wangjie on 2017/4/7.
 */

/* 
 * 本系统关于浏览器前进后退事件的一点说明 2018.1.24 （影响base.js  index.js）
 * 起因：通过套嵌iframe实现类路由页面，iframe的src变化也会被记录到宿主的history里面，此时点击前进后退，iframe内容会刷新，
 *       但iframe的src并没有刷新(iframe的contentDocument.URL可以得到正确的src地址)，菜单列表的选中效果也不对应(需要点击事件触发)，
 *       sessionStorage里记录的menuId(菜单click时记录的)也没刷新；
 * 解决：在iframe onload事件之后，对比其contentDocument.URL中的menuId是否和菜单列表当前选中的menuId一样，若不一样则表明点击了前进或后退。
 *       1、模拟一次完整的菜单点击事件，但会导致页面onload之后再刷新一遍，视觉效果过于明显，弃用；
 *       2、onload之后给前进后退操作一个标识(isBackLoad)，模拟一次点击事件更新当前选中的菜单和sessionStorage里记录的menuId，但不更新iframe
 *       的src属性就不会触发iframe刷新，这个src在下次手工点击时会被赋予正确的值。(不更新这个src未发现有什么问题)。
 * 注意：点击前进后退，在iframe未onload之前sessionStorage里的menuId不是最新的，期间的请求不能用sessionStorage，应该是$.getUrlParam("menuId")
 *       而有些用了iframe的弹窗$.getUrlParam("menuId")无法获取到。综上：$.getUrlParam("menuId") || window.sessionStorage.getItem('menuId')
 */

var webInit = {
    // readUrl: comConfig.readUrl,
    // writeUrl: comConfig.writeUrl,
    // fileUrl: comConfig.fileUrl,
    // tipsColor: comConfig.tipsColor, //提示框的颜色
    // webClientId: comConfig.webClientId, // 客户端id
    // H5ClientId: comConfig.H5ClientId, // 客户端id
    // redirectUrl: comConfig.redirectUrl, // 分供方登录页
    // redirectCP: comConfig.redirectCP, // 分供方修改密码页
    // pageSize: comConfig.pageSize, //分页的默认每页显示条数
    // pageArr: comConfig.pageArr,
    taskServer:'http://172.56.33.188:8114/', // 定时任务接口
};

// 配置文件预览
var fileViewConfig = {
    // fileUrl: comConfig.fileViewUrl,
    // em_dir: comConfig.em_dir
}

// var vueTemp = new Vue(); // 实例化一个vue方便之后调用

//获取当前地址
export function getRootPath_web() {
    var curWwwPath = window.top.window.location.href;
    var pathName = window.top.window.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPath = curWwwPath.substring(0, pos);
    var projectName = pathName.substring(0, pathName.substr(1).lastIndexOf('/') + 1); // 系统路径为 服务器地址/xxx.html
    return (localhostPath + projectName);
}

export function getAccToken() {
    var ws = window.sessionStorage;
    let nowTime = new Date().getTime();
    let expiresTime = ws.getItem('expiresTime')
    if ((nowTime < expiresTime && expiresTime - nowTime < 300000) || nowTime > expiresTime) {
        $.request({
            url: "/Authorize",
            type: "POST",
            isLogin: true,
            isLoad: true,
            data: {
                grant_type: 'refresh_token',
                refresh_token: ws.getItem('refresh_token'),
            },
            success: function(data) {
                ws.setItem('token', data.access_token);
                ws.setItem('refresh_token', data.refresh_token);
                ws.setItem('expiresTime', new Date().getTime() + data.expires_in * 1000);
            }
        })
    }
    if (ws.getItem("token")) {
        var token = ws.getItem("token");
        return token;
    } else {
        $.goToLogin();
    }
}

export function isArray(aObj) {
    if (typeof Array.isArray === "function") {
        return Array.isArray(aObj);
    } else {
        return Object.prototype.toString.call(aObj) === "[object Array]";
    }
}

// $.extend({
//     msg: function(msg, type, options) {
//         !options && (options = {});
//         vueTemp.$message({
//             showClose: options.showClose || false,
//             message: msg,
//             type: type || 'info',
//             duration: options.duration || 3000
//         })
//     },

    /*获取链接中的关键字的值*/
    export function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    };
    // 用于将时间字符串转换成时间类型的对象，兼容浏览器之间的差异
    export function funNewDate(dateItem) {
        if (!dateItem) {
            return dateItem;
        }

        var cut = dateItem.indexOf('.');
        if (cut != -1) {
            dateItem = dateItem.substr(0, cut); // 去掉秒的小数
        }

        var date = new Date(dateItem + '+0800'); // '+0800'强制获取中国时间

        if(date == 'Invalid Date') {
            date = new Date(dateItem);
        }

        if (date == 'Invalid Date') {
            dateItem = dateItem.replace(/T/g, ' ');
            dateItem = dateItem.replace(/-/g, '/');
            date = new Date(dateItem + '+0800');
        }
        if (date == 'Invalid Date') {
            date = new Date(dateItem); // 对于类似于'2017-01-01'上面依然处理不了，在此处处理
        }
        console.info(date)
        return date;
    };
//     formatDateTime: function(dateItem, type) {
//         // type 0:年月日/ 1:年月日 时分/ 2:年月日 时分秒 / 3 年月日 时
//         var date;

//         if (!dateItem) {
//             return '';
//         }

//         if (typeof(dateItem.getFullYear) == 'function') {
//             date = dateItem;
//         } else {
//             date = this.funNewDate(dateItem);
//         }
//         var y = date.getFullYear();
//         var mo = date.getMonth() + 1;
//         var d = date.getDate();
//         var h = date.getHours();
//         var mi = date.getMinutes();
//         var s = date.getSeconds();

//         mo = mo < 10 ? '0' + mo : mo;
//         d = d < 10 ? '0' + d : d;
//         h = h < 10 ? '0' + h : h;
//         mi = mi < 10 ? '0' + mi : mi;
//         s = s < 10 ? '0' + s : s;

//         if (!type || type == 0) {
//             return y + '-' + mo + '-' + d;
//         } else if (type == 1) {
//             return y + '-' + mo + '-' + d + ' ' + h + ':' + mi;
//         } else if (type == 2) {
//             return y + '-' + mo + '-' + d + ' ' + h + ':' + mi + ':' + s;
//         }else if(type == 3) {
//             return y + '-' + mo + '-' + d + ' ' + h
//         }
//     },
//     refreshIFrame: function() {
//         var iIFrame = document.getElementById("index-iframe");
//         iIFrame.src = iIFrame.src;
//     },
//     // 根据loginType处理返回登录页事件
//     goToLogin: function() {
//         var loginType = window.sessionStorage.getItem('loginType');
//         var myLoginUrl = getRootPath_web() + '/login.html';
//         var mySSOUrl = getRootPath_web() + '/sso.html';

//         window.sessionStorage.clear();

//         if (loginType == 2) {
//             window.top.window.location.href = webInit.redirectUrl + '?redirectUrl=' + encodeURIComponent(mySSOUrl);
//         } else {
//             window.top.window.location.href = myLoginUrl;
//         }
//     },
//     // 非域账号前往分供方登录页
//     goToThird: function() {
//         var mySSOUrl = getRootPath_web() + '/sso.html';
//         window.top.window.location.href = webInit.redirectUrl + '?redirectUrl=' + encodeURIComponent(mySSOUrl);
//     },
//     // 公用方法拼接url地址 type: 0文件地址 1读地址 2写地址
//     joinPath: function(path, type) {
//         if (!path || path.indexOf('http:') != -1 || path.indexOf('https:') != -1) {
//             return path;
//         }
//         if (type === undefined) {
//             type = 0;
//         }
//         return [webInit.fileUrl, webInit.readUrl, webInit.writeUrl][type] + path;
//     },
//     // 计算日期指定天数后的日期
//     addData: function(num, data) {
//         var dataTemp = !data ? new Date() : new Date(data);
//         if (!num) {
//             num = 1;
//         }
//         return new Date(dataTemp.setDate(dataTemp.getDate() + num));
//     },
//     /* 获取单位属性 */
//     getSupType: function() {
//         return [{
//             name: '总包单位',
//             type: '1'
//         }, {
//             name: '承建单位',
//             type: '2'
//         }, {
//             name: '监理单位',
//             type: '3'
//         }, {
//             name: '第三方咨询单位',
//             type: '4'
//         }, {
//             name: '物业单位',
//             type: '5'
//         }];
//     },
//     /* 严重程度 */
//     getSeverity: function() {
//         return [{
//             name: '轻微',
//             type: '0'
//         }, {
//             name: '一般',
//             type: '1'
//         }, {
//             name: '严重',
//             type: '2'
//         }];
//     },
//     /*格式化树形的数据*/
//     formatterProjectData: function(pdata, props) {
//         var newData = [];
//         var pro = {};
//         pro.label = props && props.label ? props.label : "name";
//         pro.value = props && props.value ? props.value : "id";
//         pro.disabled = props && props.disabled ? props.disabled : "disabled";
//         pro.child = props && props.child ? props.child : "childnodes";
//         if (pdata.length) {
//             pdata.map(function(val) {
//                 if (val[pro.child] && val[pro.child].length > 0) {
//                     newData.push({
//                         'label': val[pro.label],
//                         'value': val[pro.value],
//                         'disabled': val[pro.disabled],
//                         'children': $.formatterProjectData(val[pro.child], pro)
//                     })
//                 } else {
//                     newData.push({
//                         'label': val[pro.label],
//                         'value': val[pro.value],
//                         'disabled': val[pro.disabled]
//                     })
//                 }
//             });
//         }
//         return newData;
//     },
//     // 获取两个日期间的所有日期
//     getAllDateBetweenTwoDate: function(begin, end) {
//         Date.prototype.format = function() {
//             var s = '';
//             var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
//             var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
//             s += this.getFullYear() + '-'; // 获取年份。
//             s += mouth + "-"; // 获取月份。
//             s += day; // 获取日。
//             return (s); // 返回日期。
//         };
//         var ab = begin.split("-");
//         var ae = end.split("-");
//         var db = new Date();
//         db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
//         var de = new Date();
//         de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
//         var unixDb = db.getTime();
//         var unixDe = de.getTime();
//         var dateArray = [];
//         for (var k = unixDb; k <= unixDe;) {
//             dateArray.push((new Date(parseInt(k))).format());
//             k = k + 24 * 60 * 60 * 1000;
//         }
//         return dateArray;
//     },
//     /**
//      * 由最末级的父Id往上找父级
//      */
//     getDefaultExpandTree: function(tree, parentId, $tree, arr) {
//         var _this = this;
//         tree.forEach(function(node) {
//             if (node.Id === parentId) {
//                 arr.push(node.Id);
//                 _this.getDefaultExpandTree($tree, node.ParentId, $tree, arr);
//             } else {
//                 if (!!node.ChildNodes && node.ChildNodes.length) {
//                     _this.getDefaultExpandTree(node.ChildNodes, parentId, $tree, arr)
//                 }
//             }
//         })
//     },
//    

       
   
// });
var commonMixin = {
    data: function() {
        return {
            menuIdMixin: $.getUrlParam("menuId"),
            userIdMixin: '',
            menusMixin: [],
            loopendMixinMixin: false,
            currentStruId: '',
            permissions: {},
        }
    },
    methods: {
        // 获取资源权限
        getPermissions: function() {
            var _this = this;
            var ws = window.sessionStorage;

            $.request({
                url: '/api/RoleBase/' + _this.userIdMixin + '/menuResources',
                type: "get",
                requestType: 'write',
                data: {
                    menuId: _this.menuIdMixin
                },
                success: function(data, res) {
                    if (res.Code == 0) {
                        _this.permissions = data;

                        // 浏览权限验证
                        if (!data.View) {
                            var topIFrame = $('#index-iframe', top.document)[0];
                            topIFrame && (topIFrame.src = 'pages/403/403.html');
                        }
                    } else {
                        $.goToLogin();
                    }
                }
            });
        },

        // 获取当前菜单
        setBreadcrumbs: function() {
            var menus = JSON.parse(window.sessionStorage.getItem('menus'));
            this.menusMixin = [];
            this.loopendMixin = false;
            this.getMenus(menus);

            this.breadcrumbs = this.menusMixin || [];
        },
        // 循环遍历出菜单信息
        getMenus: function(data) {
            if (!this.loopendMixin) {
                for (var i = 0; i < data.length; i++) {
                    if (this.loopendMixin) {
                        break;
                    }
                    var temp = data[i];
                    this.menusMixin.length = temp.Level;
                    this.menusMixin[temp.Level - 1] = temp.MenuName;
                    if (temp.MenuId == this.menuIdMixin) {
                        this.loopendMixin = true;
                    } else if (temp.Children && temp.Children.length) {
                        this.getMenus(temp.Children);
                    }
                }
            }
        },

        // 保存页面访问log
        setVisitLog: function() {

        },
        //根据分期Id获取公司Ids
        getCompanyIdFromStageId: function(data, projectId) {
            var _this = this
            data.forEach(function(ele) {
                if (ele.Id == projectId) {
                    _this.currentStruId = ele.ParentId
                    return
                } else {
                    if (ele.ChildNodes.length > 0) {
                        _this.getCompanyIdFromStageId(ele.ChildNodes, projectId)
                    }
                }
            })
            return _this.currentStruId
        }
    },
    created: function() {
        if (top.layer) {
            top.layer.closeAll('iframe');
        }

        this.userIdMixin = window.sessionStorage.getItem('userId');
        this.getPermissions();
        this.setBreadcrumbs();
    }
};
    







export const tool = {
        min: function(minValue, value) {
            if (minValue !== null && value < minValue) {
                return false;
            }

            return true;
        },
        max: function(maxValue, value) {
            if (maxValue !== null && value > maxValue) {
                return false;
            }

            return true;
        },
        //转化为小数
        decimalNum: function(value, place) {
            if (place !== undefined) {
                return parseFloat(value).toFixed(place);
            }

            return value;
        },
        //数字格式转化为会计格式
        moneyNum: function(value, place, defaultValue) {
            if (!value) {
                if (value === 0) {
                    return value;
                }

                return defaultValue === undefined ? "" : defaultValue;
            }

            // 判断是否是会计格式，如果是转换为数字
            var str = value;
            if (typeof value === "string") {
                str = parseFloat(value.replace(/,/g, ""));
                if (str === 0) {
                    return str;
                } else if (!str) {
                    return defaultValue === undefined ? "" : defaultValue;
                }
            }

            //把+-符合存储起来
            let numVal = str;
            var minus = "";
            str = (str + "").replace("-", function(arg) {
                minus = "-"
                return "";
            });

            //进行小数点存储
            var arrs = str.split(".");
            var arr = arrs[0];
            var fixed = "";
            if (arrs[1] !== undefined && place > 0) {
                fixed = "." + numVal.toFixed(place).split(".")[1]
            } else if (place) {
                var arrsCount = [];
                arrsCount.length = parseInt(place) + 1;
                fixed = "." + arrsCount.join("0");
            }

            if (arr.length < 4) {
                return minus + arr + fixed;
            }

            //翻转字符，然后每三个插入一个,
            arr = arr.split("").reverse().join("");
            var returnStr = "";
            for (var i = 0, ii = arr.length; i < ii; i = i + 3) {
                returnStr += "," + arr.slice(i, i + 3);
            }

            //再还原回来
            returnStr = returnStr.split("").reverse().join("");

            //再进行最后的拼接，把符合、小数点等加上
            returnStr = minus + returnStr.slice(0, returnStr.length - 1) + fixed;

            return returnStr;
        },
        //会计格式转化为数字
        parseNum: function(value) {
            return (value + "").replace(/,/g, "");
        }
    }
    