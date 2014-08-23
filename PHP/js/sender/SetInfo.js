
$(function()
{
    if(!$('#app_title_').val() || !$('#app_id').val() || !$('#app_secret_key').val())
    {
        app.showAlert("Заполните все данные");
        return;
    }
    
    if(!$.isNumeric($('#app_id').val())){
        app.showAlert("Вы ввели неправильный ID приложения");
        return;
    }
    
    if($('#app_id').val() && $('#app_secret_key').val())
    {
        $.post(host_server, {
            action: "set_setting_app_data",
            title_app: $('#app_title_').val(),
            app_id: $('#AppId_settings').val(),
            app_id_new: $('#app_id').val(),
            key_app: $('#app_secret_key').val()
        }, function(data) {
            if(data.valid_app == 0)
            {
                app.showAlert("Приложение с таким ID не существует!");
                return;
            }
            
            if(data.valid_secure_key == 0)
            {
                app.showAlert(data.message);
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
        });
    } else
        app.showAlert("Введите Данные!");
});
