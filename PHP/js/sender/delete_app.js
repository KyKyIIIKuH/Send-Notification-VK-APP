
$(function()
{
    $.post(host_server, {
        action: "delete_app",
        app_id: $('#apps').val()
    }, function (data){       
        if(data.status == 0)
        {
            app.showAlert("Ошибка: Удаление не было произведено.");
            return;
        }
        
        //Сохраняем изменения select app
        var sel = document.getElementById('apps');
        
        for(var i = 0, j = sel.options.length; i < j; ++i) {
            if(i == 1)
            {
                var sel2 = sel.options[i].value;
                
                $.post(host_server, {
                    action: "save_selecet_app",
                    id_app: sel2
                }, function (data){
                    
                    if(data.status == 0)
                    {
                        console.log("[APP] Selected Изменения не сохранены");
                        return;
                    }
                    
                    console.log("[APP] Selected Изменения сохранены");
                });
            }
        }
        
        setTimeout(function () {
            select_get_app();
            
            LoadApp();
    		select_app();
            load_visits_app($('#apps').val());
    		GetUserApp($('#apps').val());
            list_send_load();
            GetInfo($('#apps').val());
        }, 200);
        
        app.showAlert("Приложение удалено!");
    });
});
