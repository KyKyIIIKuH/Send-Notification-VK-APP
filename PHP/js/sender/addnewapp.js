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
            app.showAlert("Вы добавляете не существующее приложение.");
            return;
        }
        
        if(data.valid_secure_key == 0)
        {
            app.showAlert(data.message);
            return;
        }
        
        if(data.status == 1)
        {
            GetInfo($('#id_app').val());
            console.log("[APP] Приложение добавлено!");
            app.showAlert("Приложение добавлено");
            LoadApp();
            GetUserApp($('#id_app').val());
            select_app();
            
            var sel = document.getElementById('apps');
            
            for(var i = 0, j = sel.options.length; i < j; ++i) {
                if(i == 1) {
                    break;
                }
            }
            
            select_get_app();
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