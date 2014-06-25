function params(start) {
    $("#send_visits_app_").html('<table width="100%" border=1><tr><td>#</td> <td>Имя</td><td>Дата посещения</td><td width="15%" colspan="2">Посещений</td></tr>');
    $("#send_visits_app_").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#send_visits_app_ > tbody > tr:last").append('<td colspan="5"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    $("#send_visits_app_").html($("#send_visits_app_").html() + "</table>");
    
    $.post(host_server, {
        action: "load_visits_app",
        app_id: document.getElementById("apps").value,
        start: start
    }, function (data){
        var grCount = data.count;
        
        $("#send_visits_app_").html('<table width="100%" border=1><tr><td>#</td> <td>Имя</td><td>Дата посещения</td><td width="15%" colspan="2">Посещений</td></tr>');
        
        if(grCount == 0)
        {
            $("#send_visits_app_").append('<tr></tr>');
            for(j=1;j<=1;j++) {
                $("#send_visits_app_ > tbody > tr:last").append('<td colspan="5">В данный момент не кто не посетил приложение</td>');
            }
        }
        
        var i_new = start;
        for (var i_2=0; i_2<grCount; i_2++) {
            if(data.response[i_2])
            {
                i_new++;
                
                var name = data.response[i_2].name;
                var datetime = data.response[i_2].datetime;
                var visits = data.response[i_2].visits;
                var info_user_logs = data.response[i_2].info_user_logs;
                
                $("#send_visits_app_").append('<tr></tr>');
                for(j=1;j<=1;j++) {
                    $("#send_visits_app_ > tbody > tr:last").append('<td>'+i_new+'</td>');
                    $("#send_visits_app_ > tbody > tr:last").append('<td>'+name+'</td>');
                    $("#send_visits_app_ > tbody > tr:last").append('<td>'+datetime+'</td>');
                    $("#send_visits_app_ > tbody > tr:last").append('<td>'+visits+'</td>');
                    $("#send_visits_app_ > tbody > tr:last").append('<td>'+info_user_logs+'</td>');
                }
            }
        }
        $("#send_visits_app_").html($("#send_visits_app_").html() + "</table>");
    });
}