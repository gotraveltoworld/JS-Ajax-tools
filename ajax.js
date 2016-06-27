/*
 *    @Description: The function define http ajax connection method.
 *    @version : 2.0
 *    @Author  : T.H. Lin
 *    @Date    : 2016/01/20 11:56
 */
function ajax(option) {
    //Check default option
    if(typeof option === "undefined" || 
              option ==  null        ||
              option ==  ""          ){
        console.log("No set request url");
        return false;
    }//fi
    //Set default option.
    var debugNor = option.debugNor || false; //Normal debug information.
    var debugAdv = option.debugAdv || false; //Advantage debug information.
    var setting = {
        url          : option.url,//Request.
        method       : option.method      || "POST"        ,
        headerType   : option.headerType  || "Content-Type",
        headerFormat : option.headerFormat||
                           "application/x-www-form-urlencoded; charset=UTF-8",
        dataType     : option.dataType    || "JSON",
        data         : option.data        || { data : "{}" },
       /**
        * Ajax connection status:
        * 1. initialized
        * 2. established
        * 3. received
        * 4. processing
        * 5. if status code equal 200 status is success,
        *    else failed(status code equal 404).
        */
        initial    : option.initial    || 
                         function(res) {
                             if(debugNor) {
                                 console.log("ajax initialized, res : " + res);
                             }//f}i
                         },
        establish  : option.establish  ||
                         function(res) {
                             if (debugNor) {
                                 console.log("ajax established, res : " + res);
                             }//fi
                         },
        received   : option.received   || 
                         function(res) {
                             if (debugNor) {
                                 console.log("ajax received, res : " + res);
                             }//fi
                         },
        processing : option.processing ||
                         function(res) {
                             if (debugNor) {
                                 console.log("ajax processing, res : " + res);
                             }//fi
                         },
        success     : option.success   ||
                         function(res) {
                             if (debugNor) {
                                 console.log("ajax success, res : " + res);
                             }//fi
                         },
        failed      : option.failed    ||
                         function(res) {
                             if (debugNor) {
                                 console.log("ajax failed, res : " + res);
                             }//fi
                         }
    };//endsetting
    //Show parameter setting.
    if(debugAdv) { console.log(setting); }//fi
    //According to user device browser create ajax object.
    function ajaxObject() {
        var xmlhttp;
        //Detect browser(microsoft ie or other)
        if(window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }//fi
        return xmlhttp;
    }//End fo ajaxObject().
    //Handle reponse data.
    function responseHttpData(ajax, setting) {
        ajax.onreadystatechange = function() {
            switch (ajax.readyState) {
                case 0:
                case "0":
                    setting.initial();
                break;
                case 1:
                case "1":
                    setting.establish();
                break;
                case 2:
                case "2":
                    setting.received();
                break;
                case 3:
                case "3":
                    setting.processing();
                break;
                case 4:
                case "4":
                    if (ajax.status == 200) {
                        setting.success(ajax.responseText);
                    } else {
                        setting.failed(ajax.responseText);
                    }//fi
                break;
                default:
                    console.log("ajax 'readyState' exception");
            }//endswitch
        }//End of onreadystatechange().
    }//End of responseHttpData().
    //Create data package(POST and GET format).
    function createData(data, type) {
        if (type == "json") {
            return "data=" + JSON.stringify(data);
        } else {
            var num   = Object.keys(data).length;
            var index = 0;
            var res   = "";
            Object.keys(data).forEach(
                function(key) {
                    res += key + "=" + data[key];
                    if (num > 0 && index < (num - 1)) {
                        res = res + "&&";
                    }//fi 
                    index += 1;
                 }//endfunction
            );//endforEach
            return res;
        }//fi
    }//End fo createData().
    //Send ajax message.
    (function send(setting, debugAdv) {
        var ajax = ajaxObject();//Create ajax object
        var method = setting.method.toLowerCase();//Change to lowcase.
        var type   = setting.dataType.toLowerCase();//Change to lowcase.
        var data = createData(setting.data, type);
        var url  = "";
        //According to method set url and data. 
        switch (method) {
            case "get":
                url  = setting.url + "?" + data;
            break;
            case "post":
                url  = setting.url;
            break;
            default:
                return "Connect method undefined(Support GET or POST)";
        }//endswitch
        ajax.open(method, url, true);
        ajax.setRequestHeader(setting.headerType, setting.headerFormat);
        responseHttpData(ajax, setting);
        ajax.send(data);//Send ajax message.
        //Adv debug information.
        if(debugAdv) console.log("url:"+url+";data:"+data);
    } )(setting, debugAdv);//Input parameter
}//End of ajax().