
$(function()
{
    $.post(host_server, {
        action: "users_list_sharing",
        app_id: $('#apps').val()
        }, function (data){
            document.getElementById("uid_user_remote_control").removeAttribute("disabled", "disabled");
            document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
            
            var grCount = data.count;
            $("#sharing_user").html('<table width="100%" border=1><tr><td colspan="2" align="center">Список пользователей ' + '</td></tr>');
            
            if(grCount == 0)
            {
                $("#sharing_user").append('<tr></tr>');
                for(j=1;j<=1;j++) {
                    $("#sharing_user > tbody > tr:last").append('<td colspan="2">Вы еще никого не добавили в общий доступ!</td>');
                }
            }
            
            for (var i=0; i<grCount; i++) {
                if(data.response[i])
                {
                    var id_app_ = data.response[i].id_app;
                    var uid_added_ = data.response[i].uid_added;
                    var uid_remote_ = data.response[i].uid_remote;
                    var real_name_ = data.response[i].real_name;
                    
                    $("#sharing_user").append('<tr></tr>');
                    for(j=1;j<=1;j++) {
                        $("#sharing_user > tbody > tr:last").append('<td><a href="//vk.com/id'+uid_remote_+'" target="_blank">' + real_name_ + '</a></td>');
                        $("#sharing_user > tbody > tr:last").append('<td><span class="glyphicon glyphicon-remove" onclick="javascript:delete_remote_control('+uid_remote_+');" style="cursor: pointer;" title="Удалить"></span></td>');
                    }
                }
            }
            
            $("#sharing_user").html($("#sharing_user").html() + "</table>");
        });
});
