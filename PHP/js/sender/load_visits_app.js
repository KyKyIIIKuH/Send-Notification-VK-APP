var td_load = function() {
    $("#send_visits_app_").html('<tr><td>#</td><td>Имя</td><td>Дата посещения</td><td width="15%" style="text-align:center;" colspan="3">Посещений</td></tr>');
};

function params(start) {
    
    td_load();
    
    $("#send_visits_app_").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#send_visits_app_ > tr:last").append('<td colspan="6"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    
    $.post(host_server, {
        action: "load_visits_app",
        app_id: document.getElementById("apps").value,
        start: start
    }, function (data){
        var grCount = data.count;
        var gRUsersUID = data.userids;
        
        if(grCount == 0)
        {
            td_load();
            $("#send_visits_app_").append('<tr></tr>');
            for(j=1;j<=1;j++) {
                $("#send_visits_app_ > tr:last").append('<td colspan="6">В данный момент не кто не посетил приложение</td>');
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
                                    
                                    for(j=1;j<=1;j++) {
                                        $("#send_visits_app_").append('<tr></tr>');
                                        $("#send_visits_app_ > tr:last").append('<td>'+i_new+'</td>');
                                        $("#send_visits_app_ > tr:last").append('<td><a href="//vk.com/id'+data_vk_users_get.response[i].id+'" target="_blank">'+name+'</a></td>');
                                        $("#send_visits_app_ > tr:last").append('<td>'+datetime+'</td>');
                                        $("#send_visits_app_ > tr:last").append('<td>'+visits+'</td>');
                                        $("#send_visits_app_ > tr:last").append('<td>'+info_user_logs+'</td>');
                                        $("#send_visits_app_ > tr:last").append('<td>'+country+'</td>');
                                        }
                                }
                            }
                        });
    });
}