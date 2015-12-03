$(function()
{
    var title_app = $('#title_app').val();
    var app_id = $('#id_app').val();
    var key_app = $('#key_app').val();
    
    if(!title_app || !app_id || !key_app)
    {
        app.showAlert("Заполните все поля");
        return;
    }
    
    if(!$.isNumeric(app_id)){
        app.showAlert("Вы ввели неправильный ID приложения");
        return;
    }
    
    if( title_app.indexOf('http://vk.com/') == 0 || title_app.indexOf('https://vk.com/') == 0 )
    {
        app.showAlert("Ссылки в названии запрещены!");
        return;
    }
    
    $.post(host_server, {
        action: "set_add_new_app",
        title_app: title_app,
        id_app: app_id,
        key_app: key_app
    }, function(data) {   
        
        if(data.status == -777) {
            app.showAlert(data.message);
            return;
        }
        
        if(data.valid_app == 0)
        {
            app.showAlert(data.message);
            return;
        }
        
        if(data.valid_secure_key == 0)
        {
            app.showAlert(data.message);
            return;
        }
        
        if(data.status == 1)
        {
            console.log("[APP] Приложение добавлено!");
            app.showAlert("Приложение добавлено");
            
            GetInfo($('#apps').val());
            LoadApp();
            GetUserApp($('#apps').val());
            select_app();
            
            select_get_app();
            
            setTimeout(function () {
                var sel = document.getElementById('apps');
                for(var i = 0, j = sel.options.length; i < j; ++i) {
                    if(i == gRCountAppUser) {
                        sel.selectedIndex = i;
                        break;
                    }
                }
            }, 200);
            
            setTimeout(function () {
                var sel = document.getElementById('apps');
                
                for(var i = 0, j = sel.options.length; i < j; ++i) {
                    if(i == gRCountAppUser) {
                        var sel2 = sel.options[i].value;
                        
                        console.log(sel2 + " <<<< " + gRCountAppUser);
                        
                        $.post(host_server, {
                            action: "save_selecet_app",
                            id_app: sel2
                        }, function (data){
                        });
                    }
                }
            }, 400);
        }
        
        if(data.status == 0)
        {
            console.log("[APP] Приложение не добавлено!");
            app.showAlert("Приложение не добавлено!");
        }
        
        if(data.status == -4)
        {
            console.log("[APP] Приложение уже добавлено!");
            app.showAlert("Приложение уже добавлено!");
        }
    });
});