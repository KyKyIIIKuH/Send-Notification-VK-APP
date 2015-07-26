
$(function()
{
    $("#send_list_app_").html('<table width="100%" border=1><tr><td>#</td><td>Дата отправки</td><td width="600%">Сообщение</td></tr>');
    $("#send_list_app_").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#send_list_app_ > tbody > tr:last").append('<td colspan="6"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    $("#send_list_app_").html($("#send_list_app_").html() + "</table>");
    
    $.post(host_server, {
        action: "load_list_send_",
        app_id: document.getElementById("apps").value
        }, function (data_list_send_){
            setInterval(function() {
                var url = host_server_js+"/block_sender.js?";
                $.getScript( url, function() {
                    $(function () {
                    });
                });
            }, 1500);
            
            var grCount = data_list_send_.count;
            
            $("#send_list_app_").html('<table width="100%" border=1><tr><td>#</td><td>Дата отправки</td><td width="60%" colspan="4">Сообщение</td></tr>');
            
            if(grCount == 0)
            {
                $("#send_list_app_").append('<tr></tr>');
                for(j=1;j<=1;j++) {
                    $("#send_list_app_ > tbody > tr:last").append('<td colspan="6">У вас нет отправленных уведомлений</td>');
                }
            }
            
            var i_new = 0;
            for (var i_2=0; i_2<grCount; i_2++) {
                if(data_list_send_.response[i_2])
                {
                    i_new++;
                    var datetime = data_list_send_.response[i_2].datetime;
                    var message = data_list_send_.response[i_2].message;
                    var type_sender = data_list_send_.response[i_2].type_sender;
                    var info_sender = data_list_send_.response[i_2].info_sender;
                    var delete_sender = data_list_send_.response[i_2].delete_sender;

                    $("#send_list_app_").append('<tr></tr>');
                    for(j=1;j<=1;j++) {
                        $("#send_list_app_ > tbody > tr:last").append('<td>'+i_new+'</td>');
                        $("#send_list_app_ > tbody > tr:last").append('<td>'+datetime+'</td>');
                        $("#send_list_app_ > tbody > tr:last").append('<td>'+message+'</td>');
                        $("#send_list_app_ > tbody > tr:last").append('<td>'+type_sender+'</td>');
                        $("#send_list_app_ > tbody > tr:last").append('<td>'+info_sender+'</td>');
                        
                        if(delete_sender)
                            $("#send_list_app_ > tbody > tr:last").append('<td>'+delete_sender+'</td>');
                        else
                            $("#send_list_app_ > tbody > tr:last").append('<td></td>');
                    }
                }
            }
            
            $("#send_list_app_").html($("#send_list_app_").html() + "</table>");
            console.log("Список отправленных уведомлений успешно загружены!");
        });
        
});