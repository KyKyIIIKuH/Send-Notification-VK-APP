var td_load = function() {
    $("#send_visits_app_").html('<tr><td>#</td><td>Имя</td><td>Дата посещения</td><td width="15%" style="text-align:center;" colspan="4">Посещений</td></tr>');
};

function params(start) {
    
    td_load();
    
    $("#send_visits_app_").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#send_visits_app_ > tr:last").append('<td colspan="7"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    
    var xmlhttp=new ajaxRequest();
    xmlhttp.open("POST", host_server, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    
    xmlhttp.onreadystatechange=function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200) {
            var data = xmlhttp.responseText;
            
            if(data) {
                data = JSON.parse(data);
                var grCount = data.count;
                var gRUsersUID = data.userids;
                
                $("#send_visits_app_").html(null);
                
                if(grCount == 0)
                {
                    td_load();
                    $("#send_visits_app_").append('<tr></tr>');
                    for(j=1;j<=1;j++) {
                        $("#send_visits_app_ > tr:last").append('<td colspan="7">В данный момент не кто не посетил приложение</td>');
                    }
                    
                    return;
                }
                
                var i_new = start;
                td_load();
                
                vkapi.users.get({user_ids: gRUsersUID, v:5.23}, 
                                function(data_vk_users_get){
                                    if(data_vk_users_get.response && data.response) {
                                        
                                        var grCount_vk = data_vk_users_get.response;
                                        
                                        td_load();
                                        
                                        for(i=0;i<=parseInt(grCount_vk.length - 1);i++) {
                                            
                                            i_new++;
                                            
                                            var name = data_vk_users_get.response[i].last_name +' ' + data_vk_users_get.response[i].first_name;
                                            var datetime = data.response[i].datetime;
                                            var visits = data.response[i].visits;
                                            var info_user_logs = data.response[i].info_user_logs;
                                            var country = data.response[i].country;
                                            var browser = data.response[i].browser;
                                            
                                            for(j=1;j<=1;j++) {
                                                
                                                /*
                                                vkapi.users.isAppUser({user_id: data_vk_users_get.response[i].id}, 
                                                    function(data){
                                                        console.log( data );
                                                    });
                                                */
                                                
                                                $("#send_visits_app_").append('<tr></tr>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+i_new+'</td>');
                                                $("#send_visits_app_ > tr:last").append('<td><a href="//vk.com/id'+data_vk_users_get.response[i].id+'" target="_blank">'+name+'</a></td>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+datetime+'</td>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+visits+'</td>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+info_user_logs+'</td>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+country+'</td>');
                                                $("#send_visits_app_ > tr:last").append('<td>'+browser+'</td>');
                                            }
                                        }
                                    }
                                });
            }
        }
    };
    
    xmlhttp.send("action=load_visits_app&app_id="+document.getElementById("apps").value+"&start="+start);
    
    console.log("[APP] Список посещений загружен!");
}