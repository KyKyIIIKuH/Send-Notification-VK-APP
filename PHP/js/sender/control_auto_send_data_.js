$(function()
{
    if(!$('#message_auto_sender').val())
    {
        app.showAlert("Заполните поле Сообщение");
        return;
    }
    
    var message_send = $('#message_auto_sender').val();
    if(message_send.length < 10)
    {
        app.showAlert("Сообщение должно содержать более 10 символов.");
        return;
    }
    
    if(!$('#datetimepicker').val())
    {
        app.showAlert("Заполните поле Дата/Время");
        return;
    }
    
    var sFinish = parseInt($('#count_users_all').text());
    
    if(sFinish == 0) {
        app.showAlert("Задание не может быть добавлено, т.к в вашем приложении нету пользователей.");
        return false;
    }
    
    var url2 = "//ploader.ru/vkapp/sender/js/sender/autosend_add_.js";
    $.getScript( url2, function() {
        $(function () {
        
        });
    });
});