
/*
$(function()
{
    $.post(host_server, {
        action: "get_selected_app"
    }, function (data){    
        if(data.status == 0)
            return;
        
        var sel = document.getElementById('apps');
        var val = data.selected_app;
        
        for(var i = 0, j = sel.options.length; i < j; ++i) {
            var sel2 = sel.options[i].value;
            
            if(searchText(sel2, val) === true) {
                sel.selectedIndex = i;
                break;
            }
        }
    });
    
    setTimeout(function () {
        select_app();
        load_visits_app($('#apps').val());
        GetUserApp($('#apps').val());
        list_send_load();
        GetInfo($('#apps').val());
        fisrt_start();
        send_time_last_();
    }, 300);
});
*/

$(function()
{
    var xmlhttp=new ajaxRequest();
    xmlhttp.open("POST", host_server, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
    xmlhttp.onreadystatechange=function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200) {
            var data = xmlhttp.responseText;
            data = JSON.parse(data);
            
            if(data.status == 0)
                return
            
            var sel = document.getElementById('apps');
            var val = data.selected_app;
            
            for(var i = 0, j = sel.options.length; i < j; ++i) {
                var sel2 = sel.options[i].value;
                
                if(searchText(sel2, val) === true) {
                    sel.selectedIndex = i;
                    console.log("[APP] Последнее приложение выбрано!");
                    setTimeout(function () {
                        select_app();
                        GetInfo();
                        GetUserApp();
                        
                        load_visits_app();
                        
                        list_send_load();
                        fisrt_start();
                        send_time_last_();
                    }, 300);
                    break;
                }
            }
        }
    };
    
    xmlhttp.send("action=get_selected_app");
});
