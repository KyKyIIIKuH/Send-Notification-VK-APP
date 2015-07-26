
$(function()
{
    title_app = $('#app_title_').val();
    
    if(!title_app || !$('#app_id').val() || !$('#app_secret_key').val())
    {
        app.showAlert("Заполните все данные");
        return;
    }
    
    if(!$.isNumeric($('#app_id').val())){
        app.showAlert("Вы ввели неправильный ID приложения");
        return;
    }
    
    if( title_app.indexOf('http://vk.com/') == 0 || title_app.indexOf('https://vk.com/') == 0 )
    {
        app.showAlert("Ссылки в названии запрещены!");
        return;
    }
    
    if($('#app_id').val() && $('#app_secret_key').val())
    {
        $.post(host_server, {
            action: "set_setting_app_data",
            title_app: title_app,
            app_id: $('#AppId_settings').val(),
            app_id_new: $('#app_id').val(),
            key_app: $('#app_secret_key').val()
        }, function(data) {
            if(data.valid_app == 0)
            {
                app.showAlert("Приложение с таким ID не существует!");
                $(".loader_content").css("display", "none");
                return;
            }
            
            if(data.valid_secure_key == 0)
            {
                app.showAlert(data.message);
                $(".loader_content").css("display", "none");
                return;
            }
            
            if(data.status == "-777") {
                app.showAlert(data.message);
                $(".loader_content").css("display", "none");
                return;
            }
            
            if(data.status == "1")
            {
                if(data.error == 0)
                {
                    LoadApp();
                    GetUserApp(document.getElementById("apps").value);
                    select_app();
                    app.showAlert("Данные Сохранены");
                }
                else
                    app.showAlert("УПС ошибка сохранения");
            }
            else if(data.status == "0")
                app.showAlert("УПС ошибка доступа");
            
            $(".loader_content").css("display", "none");
        });
    } else
        app.showAlert("Введите Данные!");
});
