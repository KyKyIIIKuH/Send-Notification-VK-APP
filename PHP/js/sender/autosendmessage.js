$(function()
{
    $("#autosend_list_active").html('');
    
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
    
    $("#autosend_list_active").append('<tr></tr>');
    for(j=1;j<=1;j++) {
        $("#autosend_list_active > tr:last").append('<td colspan="5"><p><img src="//vk.com/images/upload.gif"/></p></td>');
    }
    
    $.post(host_server, {
        action: "autosend_load_ations",
        app_id: $('#apps').val()
        }, function (data){
            var grCount = data.count;
            
            if(grCount == 0)
            {
                $("#autosend_list_active").html('');
                $("#autosend_list_active").append('<tr></tr>');
                for(j=1;j<=1;j++) {
                    $("#autosend_list_active > tr:last").append('<td colspan="5" align="center">У вас нет добавленных заданий!</td>');
                }
                return;
            }
            
            var i_new = 0;
            
            $("#autosend_list_active").html('');
            
            for (var i=0; i<grCount; i++) {
                if(data.response[i])
                {
                    i_new++;
                    
                    var id_ = data.response[i].id;
                    var message_ = data.response[i].message;
                    var datetime_start_ = data.response[i].datetime_start;
                    var progress_ = data.response[i].progress;
                    var status_ = data.response[i].status;
                    
                    if(status_ == 0)
                        status_ = '<span class="glyphicon glyphicon-refresh" rel="tooltip" title="Ждёт выполнения"></span>';
                    
                    if(status_ == 1)
                        status_ = '<span class="glyphicon glyphicon-thumbs-up" rel="tooltip" title="Выполено"></span>';
                    
                    if(status_ == 2)
                        status_ = '<span class="glyphicon glyphicon-upload" rel="tooltip" title="Выполняется"></span>';
                    
                    $("#autosend_list_active").append('<tr></tr>');
                    for(j=1;j<=1;j++) {
                        $("#autosend_list_active > tr:last").append('<td align="center" id="autosendid'+parseInt(id_)+'" class="autosendid">' + i_new + '</td>');
                        $("#autosend_list_active > tr:last").append('<td align="center"> <span id="read_autosend'+parseInt(id_)+'" class="read_autosend"><span class="glyphicon glyphicon-comment" rel="tooltip" title="Прочитать сообщение"></span></span></td>');
                        $("#autosend_list_active > tr:last").append('<td align="center">' + datetime_start_ + '</td>');
                        $("#autosend_list_active > tr:last").append('<td align="center">' + progress_ + '%</td>');
                        $("#autosend_list_active > tr:last").append('<td align="center">' + status_ + '</td>');
                        $("#autosend_list_active > tr:last").append('<td><span id="edit_autosend'+parseInt(id_)+'" class="glyphicon glyphicon-pencil" rel="tooltip" title="Редактировать"></span> <span id="delete_autosend'+parseInt(id_)+'" class="glyphicon glyphicon-trash" rel="tooltip" title="Удалить"></span></td>');
                    }
                }
            }
        });
        
        //Поиск всех элементов для прочтения
        setTimeout(function () {
            
            $("td[class~='autosendid']").each(function() {
                var read_autosend = $(this)[0].id;
                read_autosend = parseInt(read_autosend.replace(/\D+/g,""));
                
                $('#read_autosend'+read_autosend+'').css("cursor", "pointer");
                $('#edit_autosend'+read_autosend+'').css("cursor", "pointer");
                $('#delete_autosend'+read_autosend+'').css("cursor", "pointer");
                
                //Чтение сообщения
                $('#read_autosend'+read_autosend+'').on('click', function(){
                    var read_autosend_int = $(this)[0].id;
                    read_autosend_int = parseInt(read_autosend_int.replace(/\D+/g,""));
                    
                    $.post(host_server, {
                        action: "status_autosend_read",
                        app_id: $('#apps').val(),
                        id_send: parseInt(read_autosend_int)
                        }, function (data){
                            if(data.status == 1) {
                                var buttons={'select':{label: 'Закрыть', callback: function(){ }}};
                                app.showDialog('Сообщение', data.message, buttons);
                            }
                        });
                });
                
                //Редактировать данные
                $('#edit_autosend'+read_autosend+'').on('click', function(){
                    var buttons={'select':{label: 'Закрыть', callback: function(){ }}};
                    app.showDialog('Редактирование данных', "", buttons);
                });
                
                //Удаление запроса
                $('#delete_autosend'+read_autosend+'').on('click', function(){                    
                    $.post(host_server, {
                        action: "delete_autosend",
                        app_id: $('#apps').val(),
                        id_send: parseInt(read_autosend)
                        }, function (data){
                            if(data.status == 1) {
                                if(data.success == 1) {
                                    autosendmessage();
                                    app.showAlert("Запрос удалён.");
                                }
                            }
                        });
                });
            });
        }, 1000);
});