$(function()
{
    $.post(host_server, {
        action: "autosend_add_aсtions",
        app_id: document.getElementById("apps").value,
        message: $('#message_auto_sender').val(),
        datetime: $('#datetimepicker').val() + ":00"
    }, function(data) {
        
        if(data.status == 0)
        {
            if(data.error == -7)
            {
                app.showAlert(data.message);
                return;
            }
            
            if(data.error == -2)
            {
                app.showAlert(data.message);
                return;
            }
            
            if(data.error == -3)
            {
                app.showAlert(data.message);
                return;
            }
            
            app.showAlert("Задание не добавлено!");
            return;
        }
        
        autosendmessage();
        app.showAlert("Задание добавлено!");
    });
});