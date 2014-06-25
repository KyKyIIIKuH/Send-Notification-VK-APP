$(function()
{
    var maxLength2 = $('#message_sender').attr('maxlength');        //(1)
    $('#message_auto_sender').keyup(function()
    {
        var curLength2 = $('#message_auto_sender').val().length;         //(2)
        $(this).val($(this).val().substr(0, maxLength2));     //(3)
        var remaning2 = maxLength2 - curLength2;
        if (remaning2 < 0) remaning2 = 0;
        $('#message_auto_length').html(remaning2); //(4)
    });
    
    var url = "//ploader.ru/vkapp/sender/js/datetimepicker/jquery.datetimepicker.js";
    $.getScript( url, function() {
        $(document).ready(function() {
            
            $('#datetimepicker').datetimepicker('destroy');
            $('#datetimepicker').datetimepicker()
                .datetimepicker({step:5, lang:'ru',
                                 format:'Y-m-d H:i',formatDate:'Y-m-d H:i:s'});
        });
    });
    
    $("#autosend_list_active").html('<table class="table table-hover" id="autosend_list_active"><thead><tr><th>#</th><th width="20%">Сообщение</th><th>Дата/Время старта</th><th>Выполнено</th><th>Статус</th></tr></thead>');
    $("#autosend_list_active").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#autosend_list_active > tbody > tr:last").append('<td colspan="5"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    $("#autosend_list_active").html($("#autosend_list_active").html() + "</table>");
    
    $.post(host_server, {
        action: "autosend_load_ations",
        app_id: $('#apps').val()
        }, function (data){
            var grCount = data.count;
            $("#autosend_list_active").html('<table class="table table-hover" id="autosend_list_active"><thead><tr><th>#</th><th width="20%">Сообщение</th><th>Дата/Время старта</th><th>Выполнено</th><th>Статус</th></tr></thead>');
            
            if(grCount == 0)
            {
                $("#autosend_list_active").append('<tbody><tr></tr></tbody>');
                for(j=1;j<=1;j++) {
                    $("#autosend_list_active > tbody > tr:last").append('<td colspan="5" align="center">У вас нет добавленных заданий!</td>');
                }
            }
            
            var i_new = 0;
            
            for (var i=0; i<grCount; i++) {
                if(data.response[i])
                {
                    i_new++;
                    
                    var message_ = data.response[i].message;
                    var datetime_start_ = data.response[i].datetime_start;
                    var progress_ = data.response[i].progress;
                    var status_ = data.response[i].status;
                    
                    $("#autosend_list_active").append('<tbody><tr></tr></tbody>');
                    for(j=1;j<=1;j++) {
                        $("#autosend_list_active > tbody > tr:last").append('<td>' + i_new + '</td>');
                        $("#autosend_list_active > tbody > tr:last").append('<td>' + message_ + '</td>');
                        $("#autosend_list_active > tbody > tr:last").append('<td>' + datetime_start_ + '</td>');
                        $("#autosend_list_active > tbody > tr:last").append('<td align="center">' + progress_ + '%</td>');
                        $("#autosend_list_active > tbody > tr:last").append('<td>' + status_ + '</td>');
                    }
                }
            }
            
            $("#autosend_list_active").html($("#autosend_list_active").html() + "</table>");
        });

});