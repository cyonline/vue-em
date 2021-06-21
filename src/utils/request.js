    /*公用请求方法*/
    export function request(options) {

        var host = options.host || webInit.writeUrl;
        var auth = "Basic V2ViQXBwOnNhcGlAMTIzNA==";
        var optionType = (options.type || '').toUpperCase();
        var loadMask, token;
        // var conType = options.contentType || "application/x-www-form-urlencoded";

        // 读写库同步存在延迟，非get请求的下一个get请求用写库
        if (optionType == 'GET' && window.sessionStorage.getItem('lastOptionType') != '1') {
            host = webInit.readUrl;
        }
        
        if (options.requestType == 'read') {
            host = webInit.readUrl;
        }else if (options.requestType == 'file') {
            host = webInit.fileUrl;
        }else {
            host = webInit.writeUrl;
        }

        if(options.hostEternity){
            host = options.host;
        }


        if (!options.isLogin) {
            token = window.sessionStorage.getItem("token");
            if (!token) {
                $.goToLogin();
            }
            auth = "bearer " + token;
        }

        if (options.isLogin || getAccToken()) {
            var ajaxObj = {
                type: options.type,
                url: host + options.url,
                data: options.data || "",
                contentType: options.contentType,
                dataType: options.dataType || 'json',
                crossDomain: true == !(document.all), // 兼容ie9跨域请求
                beforeSend: function(request) {
                    if (options.beforeSend) {
                        options.beforeSend.call(this, request);
                    }
                    if (options.isLoad && layer) {
                        loadMask = layer.load(2);
                    }
                    request.setRequestHeader("Authorization", auth);

                    // iframe弹出的页面窗口 $.getUrlParam("menuId")没有值，此时取sessionStorage中的值
                    request.setRequestHeader("menuId", $.getUrlParam("menuId") || window.sessionStorage.getItem('menuId'));
					request.setRequestHeader("RefreshToken",window.sessionStorage.getItem("refresh_token") || null);
                },
                success: function(result) {
                    if (options.isLogin) {
                        options.success.call(this, result);
                    } else {
                        if (result.Code == -1) {
                            $.msg("服务器异常，请联系管理员", 'error');
                        } else if (result.Code != 0 && result.Message) {
                            $.msg(result.Message, 'error');
                        }

                        // 读写库同步存在延迟，非get请求的下一个get请求用写库，存放一个标识在session中
                        window.sessionStorage.setItem('lastOptionType', optionType == 'GET' ? '0' : '1');

                        if (options.success) {
                            options.success.call(this, result.Data, result);
                        }
                    }
                },
                error: function(XMLHttpRequest) {
                    if (XMLHttpRequest.status == '401') {
                        $.goToLogin();
                    } else if (XMLHttpRequest.status == '404') {
                        $.msg('服务器异常，请联系管理员', 'error');
                    } else if (XMLHttpRequest.status == '403') {
                        $.msg('无菜单资源权限，请联系管理员', 'error');
                    } else if (XMLHttpRequest.responseText) {
                        var rsp = JSON.parse(XMLHttpRequest.responseText);
                        if (rsp && rsp.error_description) {
                            $.msg(rsp.error_description, 'error');
                        }
                    }
                    if (options.error) {
                        options.error.call(this, XMLHttpRequest);
                    }
                },
                complete: function() {
                    if (options.complete) {
                        options.complete.call(this, XMLHttpRequest);
                    }
                    if (options.isLoad && loadMask && layer) {
                        layer.close(loadMask);
                    }
                }
            }

            if (isArray(ajaxObj.data) || ajaxObj.contentType) {
                ajaxObj.contentType = ajaxObj.contentType || "application/json";
                ajaxObj.data = JSON.stringify(ajaxObj.data);
            }

            $.ajax(ajaxObj);
        }
    };
    /*发送文件 文件以数组的方式传入 支持多个*/
    export function importFiles(options) {
        var host = options.host || webInit.fileUrl;
        var token = window.sessionStorage.getItem("token");
        if (!token) {
            $.goToLogin();
        }
        var auth = "bearer " + token;

        var formData = new FormData();
        if (options.files && options.files.length) {
            for (var i = 0, len = options.files.length; i < len; i++) {
                formData.append("file" + i, options.files[i]);
            }
        }

        var loadMask;

        $.ajax({
            url: host + options.url,
            type: "POST",
            data: formData,
            contentType: false, // 必须false才会自动加上正确的Content-Type
            processData: false, // 必须false, 避开jQuery(进而让XMLHttpRequest)对 formdata 进行处理
            crossDomain: true == !(document.all), // 兼容ie9跨域请求
            beforeSend: function(request) {
                if (options.beforeSend) {
                    options.beforeSend.call(this, request);
                }
                if (options.isLoad && layer) {
                    loadMask = layer.load(2);
                }
                request.setRequestHeader("Authorization", auth);
                request.setRequestHeader("menuId", $.getUrlParam("menuId") || window.sessionStorage.getItem('menuId'));
                request.setRequestHeader("RefreshToken",window.sessionStorage.getItem("refresh_token") || null);
            },
            success: function(result) {
                if (result.Code == -1) {
                    $.msg("服务器异常，请联系管理员", 'error');
                } else if (result.Code != 0 && result.Message) {
                    $.msg(result.Message, 'error');
                }
                if (options.success) {
                    options.success.call(this, result.Data, result);
                }
            },
            error: function(XMLHttpRequest) {
                if (XMLHttpRequest.status == '401') {
                    $.goToLogin();
                } else if (XMLHttpRequest.status == '404' || XMLHttpRequest.status == '500') {
                    $.msg('服务器异常，请联系管理员', 'error');
                } else if (XMLHttpRequest.status == '403') {
                    $.msg('无菜单资源权限，请联系管理员', 'error');
                } else if (XMLHttpRequest.responseText) {
                    var rsp = JSON.parse(XMLHttpRequest.responseText);
                    if (rsp && rsp.error_description) {
                        $.msg(rsp.error_description, 'error');
                    }
                }
                if (options.error) {
                    options.error.call(this, XMLHttpRequest);
                }
            },
            complete: function() {
                if (options.complete) {
                    options.complete.call(this, XMLHttpRequest);
                }
                if (options.isLoad && loadMask && layer) {
                    layer.close(loadMask);
                }
            }
        });
    };

        // 根据文件路径下载文件方法，
    export function downloadFile(dataUrl, fileName) {
        var request = new XMLHttpRequest();
        request.responseType = "blob";//定义响应类型
        request.open("GET", dataUrl);
        request.onload = function () {
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = fileName
            a.click();
        }
        request.send();
    }

    export function exportFile(url,data,type){
                if(!type){
                    type = 'post'
                }
                if(url.indexOf("http://") === -1) {
                    url = comConfig.writeUrl + url;
                }
                if (type.toUpperCase() == 'POST') {
                    var form = document.createElement("form");
                    form.style.display = "none";
                    form.action = url;
                    form.method = type;
                    form.target = '_blank'
                    document.body.appendChild(form);
                    
                    Object.getOwnPropertyNames(data).forEach(function(key){
                        if(data[key] instanceof Array){
                            data[key].forEach(function(ele,index){
                                var input = document.createElement("input");
                                input.type = "hidden";
                                input.name = key+'[]';
                                input.value = ele;
                                form.appendChild(input);
                            })
                        }
                        else{
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = key;
                            input.value = data[key];
                            form.appendChild(input);
                        }
                        
                    })
                    var input = document.createElement("input");
                    input.type = "hidden";
                    input.name = 'userId';
                    input.value = window.sessionStorage.getItem('userId');
                    form.appendChild(input);
        
                    form.submit();
                    form.parentNode.removeChild(form)
                    //ie不兼容remove(),会报错，导致导出方法的layer.close(index)不能执行，弹窗关闭不了
                    // form.remove();
                } else {
                    var token = window.sessionStorage.getItem('token');
                    var aHref = url + "?access_token=" + token;
                    Object.getOwnPropertyNames(data).forEach(function(key){  
                        aHref += "&" + key + "=" + data[key];
                    })
                    var userId = window.sessionStorage.getItem('userId');
                    aHref += "&userId=" + userId;
                    
                    window.open(aHref)
                }
            }
        