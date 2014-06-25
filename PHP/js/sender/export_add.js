$(function()
{
    $.post(host_server, {
        action: "export_add",
        app_id: document.getElementById("apps").value
    }, function(data) {
        if(data.status == 0)
        {
            app.showAlert("Задание на экспорт не добавлено!");
            return;
        }
        
        Export();
        app.showAlert("Задание на экспорт добавлено!");
    });
});