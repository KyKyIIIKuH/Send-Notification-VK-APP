function params_GetUserApp(start) {
    
    //document.getElementById("block_users").style.display = '';
    document.getElementById("search_user").style.display = '';
    
    var userarraydata;
    
    $('#count_users_all').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    
    $.post(host_server, {
        action: "get_app_user_list",
        id_app: document.getElementById("apps").value,
        start: start
    }, function(data) {
        userarraydata = data;
        
        var gRCount = userarraydata.count;
        var gRUsersUID = userarraydata.userids;
        var gRCountUserDayVisit = userarraydata.day_visits;
        
        if(gRCount == 0)
        {
            //$('#user_list').html("Пусто :(");
            $('#count_users_all').text('0');
            return;
        }
        
        /*
        vkapi.users.get({user_ids: gRUsersUID, v:5.23}, 
                        function(data_vk_users_get){
                            if(data_vk_users_get.response) {
                                var grCount_vk = data_vk_users_get.response;
                                
                                var user_list = "";
                                
                                for(i=0;i<=parseInt(grCount_vk.length - 1);i++) {
                                    user_list += '<label for="'+ data_vk_users_get.response[i].id +'">'+ data_vk_users_get.response[i].last_name +' ' + data_vk_users_get.response[i].first_name + '</label><br/>';
                                }
                                
                                $('#user_list').html(user_list);
                            }
                        });
        */
        
        if(gRCountUserDayVisit != 0)
            gRCountUserDayVisit = "<span style='color:green;'>+"+gRCountUserDayVisit+"</span>";
        else
            gRCountUserDayVisit = "";
        
        //sessionStorage
    	var isgRCount = sessionStorage.getItem("gRCount");
        
    	if(isgRCount == null || isgRCount == 'undefined') {
    	   if(parseInt(isgRCount) == parseInt(gRCount)) {
    	       return
           }
    	}
        
//        if(parseInt(isgRCount) != parseInt(gRCount)) {
            sessionStorage.setItem("gRCount", gRCount);
            $('#count_users_all').html(gRCount + gRCountUserDayVisit);
            console.log("[APP] Список пользователей посетивших приложение загружен!");
//        }
    });
}