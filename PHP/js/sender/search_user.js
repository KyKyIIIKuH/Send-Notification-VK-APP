$(function()
{
    document.getElementById("search_user_").setAttribute("disabled", "disabled");
    if(!$('#search_uid_user_').val())
    {
        app.showAlert("Введите ссылку на страницу пользователя которого вы хотите найти!");
        document.getElementById("search_user_").removeAttribute("disabled", "disabled");
        return;
    }
    
    var full_link = $('#search_uid_user_').val();
    var link;
    var uid_remote_control, realnameuser;
    
    if( full_link.indexOf('http://vk.com/') != -1 || full_link.indexOf('https://vk.com/') != -1 )
    {
        if( full_link.indexOf('http://vk.com/app') != -1 || full_link.indexOf('https://vk.com/app') != -1 )
        {
            app.showAlert("Вы указали неверную ссылку!");
            document.getElementById("search_user_").removeAttribute("disabled", "disabled");
            return false;
        }
        
        full_link = full_link.replace('https://vk.com/','http://vk.com/');
        link = full_link.replace('http://vk.com/', '');
        
        if( full_link.indexOf('http://vk.com/id') != -1) link = full_link.replace('http://vk.com/id', '');
        
		vkapi.users.get(
            {user_ids: link.toString()}, 
            function(data){
                if(data.response)
                {
                    uid_remote_control = data.response[0].uid;
                    realnameuser = data.response[0].first_name + " " + data.response[0].last_name;
                } else {
                    $('#search_user_list').html("<p>Такой страницы не существует!</p>");
                    document.getElementById("search_user_").removeAttribute("disabled", "disabled");
                }
            }
		);

    } else {
        app.showAlert("Вы указали неверную ссылку!");
        
        document.getElementById("search_user_").removeAttribute("disabled", "disabled");
        return false;
    }
    
    if(full_link == 'vk.com' || full_link == 'http://vk.com/' || full_link == 'http://vk.com' || link.indexOf('#/') != -1)
    {
        app.showAlert("Вы указали неверную ссылку!");
        document.getElementById("search_user_").removeAttribute("disabled", "disabled");
        return false;
    }
    
    $('#search_user_list').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    
    setTimeout(function() {
        $.post(host_server, {
            action: "search_user",
            app_id: $('#apps').val(),
            uid_search: uid_remote_control
        }, function (data){
            if(data.status == 0)
            {
                $('#search_user_list').html("<p>"+data.message+"</p>");
                document.getElementById("search_user_").removeAttribute("disabled", "disabled");
                return;
            }
            
            var content = "Имя: " + realnameuser + "<br/>";
            content += "Визитов: " + data.visits + "<br/>";
            content += "Последнее посещение: " + data.date + "<br/>";;
            content += "Страна: " + data.country;
            
            $('#search_user_list').html("<p>"+content+"</p>");
            
            document.getElementById("search_user_").removeAttribute("disabled", "disabled");
        });
    },500);
});