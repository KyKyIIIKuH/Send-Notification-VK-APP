
function params(app_id, category) {
    
    $('#send_count_').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    $('#coutry_count').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    
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
                    //document.getElementById("block_users").style.display = 'none';
                    document.getElementById("search_user").style.display = 'none';
                    document.getElementById("info_send_list").style.display = 'none';
                    document.getElementById("info_visits_list").style.display = 'none';
                    document.getElementById("settings_app_").style.display = 'none';
                    
                    app.showAlert(data25.message);
                    return;
                }
            } else {
                    document.getElementById("static_app").style.display = '';
                    //document.getElementById("info_app").style.display = '';
                    //document.getElementById("block_users").style.display = '';
                    document.getElementById("search_user").style.display = '';
                    document.getElementById("info_send_list").style.display = '';
                    document.getElementById("info_visits_list").style.display = '';
                    document.getElementById("settings_app_").style.display = '';
            }
            
            if(data25.status == 1)
            {
                /*
                //console.log(data25.iframe_url);
                
                if(data25.iframe_url == null) {
                    if(script_register == false) {
                        script_register = true;
                        //console.log("BLOCK");
                        //app.showAlert("Скрипт регистрации посещений не установлен!. <br/> Для установки зайдите в раздел '<b>Код для вставки</b>'.");
                    }
                }
                */
                
                if(data25.app_id == undefined)
                {
                    control_remote_ = 1;
                    document.getElementById("settings_app_").style.display = 'none';
                    
                    if(vk_valid_app == false) {
                        if(data25.valid_app_social == 0) {
                            vk_valid_app = true;
                            app.showAlert("[VK] Данное приложение Удалено/Заблокировано.");
                        }
                    }
                }
                else
                {
                    control_remote_ = 0;
                    document.getElementById("settings_app_").style.display = '';
                    
                    //Проверяем состояние приложения
                    if(vk_valid_app == false) {
                        if(data25.valid_app_social == 0) {
                            
                            vk_valid_app = true;
                            
                            var sel = document.getElementById('apps');
                            var val = $("#apps").val();
                            var apptitle;
                            
                            for(var i = 0, j = sel.options.length; i < j; ++i) {
                                var sel2 = sel.options[i].value;
                                
                                if(searchText(sel2, val) === true) {
                                    apptitle = sel.options[i].text;
                                    break;
                                }
                            }
                            
                            app.showConfirm("[VK] Данное приложение Удалено/Заблокировано.<br/>Удалить приложение '" + $.trim( apptitle ) + "'?", function(result){
                                if(result == true)
                                delete_app();
                            });
                        }
                    }
                }
                
                vars={
                    'id': data25.app_id,
                    'app_title_': data25.app_title,
                    'app_id': data25.app_id,
                    'app_secret_key': data25.app_secret_key
                };
                
                //title_app();
                
                setTimeout(function() {send_time_last_(data25.datetime_sender); }, 900);
                
                paginator_simple();
                
    			document.getElementById("open_app_").style.display = '';
    			$('#open_app_').html('<a href="//vk.com/app'+$('#apps').val()+'" class="btn btn-primary" target="_blank" id="btnAppOpen"><span class="glyphicon glyphicon-new-window"></span> Открыть приложение</a>');
    			
                $('#send_count_').text(data25.limit_day_send + "/3");
                
                $('#coins').text(data25.coins);
                
                $('#coutry_count').text(data25.country_count);
                
                document.getElementById("big_loading").style.display = 'none';
                
                console.log("[APP] Данные приложения загружены!");
            }
        });
    }, 500);
}