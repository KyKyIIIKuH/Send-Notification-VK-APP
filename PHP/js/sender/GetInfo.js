
function params(app_id, category) {
    setTimeout(function () {
        $.post(host_server, {
            action: "get_app_setting",
            app_id: document.getElementById("apps").value
        }, function(data25) {
            
            if(data25.status == 0)
            {
                if(data25.error == -778)
                {
                    document.getElementById("static_app").style.display = 'none';
                    document.getElementById("info_app").style.display = 'none';
                    document.getElementById("block_users").style.display = 'none';
                    document.getElementById("search_user").style.display = 'none';
                    document.getElementById("info_send_list").style.display = 'none';
                    document.getElementById("info_visits_list").style.display = 'none';
                    document.getElementById("settings_app_").style.display = 'none';
                    
                    app.showAlert(data25.message);
                    return;
                }
            } else {
                    document.getElementById("static_app").style.display = '';
                    document.getElementById("info_app").style.display = '';
                    document.getElementById("block_users").style.display = '';
                    document.getElementById("search_user").style.display = '';
                    document.getElementById("info_send_list").style.display = '';
                    document.getElementById("info_visits_list").style.display = '';
                    document.getElementById("settings_app_").style.display = '';
            }
            
            if(data25.status == 1)
            {
                if(data25.app_id == undefined)
                {
                    control_remote_ = 1;
                    document.getElementById("settings_app_").style.display = 'none';
                }
                else
                {
                    control_remote_ = 0;
                    document.getElementById("settings_app_").style.display = '';
                }
                
                vars={
                    'id': data25.app_id,
                    'app_title_': data25.app_title,
                    'app_id': data25.app_id,
                    'app_secret_key': data25.app_secret_key
                };
                
                title_app();
                
                setTimeout(function() {send_time_last_(data25.datetime_sender); }, 900);
                
                paginator_simple();
                
    			document.getElementById("open_app_").style.display = '';
    			$('#open_app_').html('<a href="//vk.com/app'+$('#apps').val()+'" class="btn btn-primary" target="_blank" id="btnAppOpen"><span class="glyphicon glyphicon-new-window"></span> Открыть приложение</a>');
    			
                $('#send_count_').text(data25.limit_day_send + "/3");
                
                $('#coins').text(data25.coins);
                
                document.getElementById("big_loading").style.display = 'none';
                
                console.log("[APP] Данные приложения загружены!");
            }
        });
    }, 500);
}