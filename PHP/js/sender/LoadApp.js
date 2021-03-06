
$(function()
{
    $('#list_added_app').html(null);
    
    //Получаем информацию о добавленных приложениях
    $('#apps').children().remove();
    $("#apps").append($('<option>', {value:"0", text: "Мои приложения", disabled: true}));
    
    var gRCount = 0;
    var load_apps = false;
    var load_remote_apps = false;
    
    $.post(host_server, {
        action: "get_app_list"
    }, function(data) {
        if(data.status == 1)
        {
            gRCount = data.count;
            gRCountAppUser = gRCount;
            
            for (var i = 0; i < gRCount; i++)
            {
                var title_app = data.response[i].title_app;
                var id_app = data.response[i].list_app;
                
                var title_app2 = "";
                
                var size = 31;
                if (title_app.length > size) {
                    title_app2 += title_app.slice(0, 31);
                    
                }
                if(title_app2)
                {
                    title_app = title_app2 + '...';
                }
                
                $("#apps").append($('<option>', {value:id_app, text: title_app}));
            }
            
            console.log("[APP] Список приложений загружен!");
            load_apps = true;
            $('#loading_list_app').html(null);
        } else {
            $("#apps").append($('<option>', {value:"0", text: "Нет добавленных приложений", disabled: true, selected: true}));
            
            if(data.banned == 1 && data.status == 0) {
                app.showAlert("<p><b>Причина блокировки:</b></p> " + data.message);
            }
            
            console.log("[APP] У пользователя нет добавленных приложений!");
            
			reset_data('addnewapp');
        }
        
        //Общий Доступ
        if(data.control_remote == 1)
        {
            $("#apps").append($('<option>', {value:"0", text: "Общий доступ", disabled: true}));
            
            var gRCountRemote = data.count_remote_app;
            for (var i2 = 0; i2 < gRCountRemote; i2++)
            {
                var title_app_ = data.response_remote_control[i2].title_app;
                var id_app_ = data.response_remote_control[i2].id_app;
                
                var title_app2 = "";
                
                var size_remote = 31;
                if (title_app_.length > size_remote) {
                    title_app2 += title_app_.slice(0, 31);
                    
                }
                if(title_app2)
                {
                    title_app_ = title_app2 + '...';
                }
                
                $("#apps").append($('<option>', {value:id_app_, text: title_app_}));
            }
            console.log("[APP] Список приложений общего доступа загружен!");
            load_remote_apps = true;
            $('#loading_list_app').html(null);
        }
        
        if(gRCount == 0 && data.control_remote != 1)
        {
            //app.showDialog('Добавить приложение',app.getTemplate('AddNewApp'),buttons_add_app);
            $('#loading_list_app').html(null);
            document.getElementById("added_app_not_function").style.display = '';
			$('#big_loading').html('');
        }
        
        //Выбираем приложение в котором пользователь находился
        if(load_apps || load_remote_apps){
            select_get_app();
            
            //document.getElementById("static_app").style.display = '';
            //document.getElementById("info_visits_list").style.display = '';
        }
    });
});
