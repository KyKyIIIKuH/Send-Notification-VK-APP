function params(start) {
    document.getElementById("block_users").style.display = '';
    document.getElementById("search_user").style.display = '';
    
    var userarraydata;
    
    $('#user_list').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    $.post(host_server, {
        action: "get_app_user_list",
        id_app: document.getElementById("apps").value,
        start: start
    }, function(data) {
        userarraydata = data;
        
        var gRCount = userarraydata.count;
        var gRcountUser = userarraydata.count_user;
        var gRCountUserDayVisit = userarraydata.day_visits;
        
        if(gRCount == 0)
        {
            $('#user_list').html("Пусто :(");
            $('#count_users_all').text('0');
            return;
        }
        
        var count_users_all = 0;
        var user_list = "";
        
        for (var i = 0; i < gRcountUser; i++)
        {
            count_users_all++;
            var username = userarraydata.response[i].name;
            var id_vk = userarraydata.response[i].uid;
            user_list += '<label for="'+id_vk+'">'+username+'</label><br/>';
        }
        $('#user_list').html(user_list);
        if(gRCountUserDayVisit != 0)
            gRCountUserDayVisit = "<span style='color:green;'>+"+gRCountUserDayVisit+"</span>";
        else
            gRCountUserDayVisit = "";
            
        $('#count_users_all').html(gRCount + gRCountUserDayVisit);
        console.log("[APP] Список пользователей посетивших приложение загружен!");
    });
}