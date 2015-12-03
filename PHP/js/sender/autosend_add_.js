$(function()
{
    //app.showAlert("Скрипт на техническом обслуживании.");
    //return;
    
    
    var useruids_auto_;
    var category_auto_ = 0;
    
    for(var i2 = 0; i2 < 1; i2++) {
        
        if(selected_user_auto_send[i2]) {
            if(selected_user_auto_send_array[i2] != undefined)
            {
                category_auto_ = i2;
                
                useruids_auto_ = selected_user_auto_send[i2];
                useruids_auto_ = useruids_auto_.toString();
            }
        }
    }
    
    $.post(host_server, {
        action: "datetime_load",
        datetime_select: $('#datetimepicker').val()
    }, function(data) {
        console.log( "======= Автоматическая отправка ================" );
        
        if(data.error == 0) {
            app.showAlert(data.message);
            console.log("Задание не может быть добавлено, ошибка #" + data.error);
            return;
        }
        
        $.post(host_server, {
            action: "autosend_add_aсtions",
            app_id: document.getElementById("apps").value,
            message: $('#message_auto_sender').val(),
            datetime: $('#datetimepicker').val() + ":00",
            category: category_auto_,
            useruids: useruids_auto_
        }, function(data) {
            if(data.status == 0)
            {
                if(data.error)
                {
                    app.showAlert(data.message);
                    return;
                }
                
                app.showAlert("Задание не добавлено!");
                console.log("Задание не добавлено");
                return;
            }
            
            //console.log(data.text);
            autosendmessage();
            app.showAlert("Задание добавлено!");
            console.log("Задание добавлено");
        });
    });
});