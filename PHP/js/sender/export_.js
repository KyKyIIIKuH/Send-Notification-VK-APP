$(function()
{
    $.post(host_server, {
        action: "export_list",
        app_id: $('#apps').val()
    }, function (data){
        var grCount = data.count;
        
        $("#export_list").html('<table class="table table-hover" id="autosend_list_active"><thead><tr><th>#</th><th>Дата/Время</th><th>Выполнено</th><th>Статус</th><th></th></tr></thead>');
        
        if(grCount == 0)
        {
            $("#export_list").append('<tbody><tr></tr></tbody>');
            for(j=1;j<=1;j++) {
                $("#export_list > tbody > tr:last").append('<td colspan="5" align="center">У вас нет заданий для экспорта!</td>');
            }
        }
        
        var i_new = 0;
        
        for (var i=0; i<grCount; i++) {
            if(data.response[i])
            {
                i_new++;
                
                var datetime_ = data.response[i].datetime;
                var progress_ = data.response[i].progress;
                var status_ = data.response[i].status;
                var download_file = data.response[i].download_file;
                
                $("#export_list").append('<tbody><tr></tr></tbody>');
                for(j=1;j<=1;j++) {
                    $("#export_list > tbody > tr:last").append('<td>' + i_new + '</td>');
                    $("#export_list > tbody > tr:last").append('<td>' + datetime_ + '</td>');
                    $("#export_list > tbody > tr:last").append('<td align="center">' + progress_ + '%</td>');
                    $("#export_list > tbody > tr:last").append('<td>' + status_ + '</td>');
                    if(progress_ == 100)
                        $("#export_list > tbody > tr:last").append('<td><a href="//ploader.ru/vkapp/sender/uploads/export/'+download_file+'" download="'+download_file+'" title="Скачать"><span class="glyphicon glyphicon-download"></span></a></td>');
                    else
                        $("#export_list > tbody > tr:last").append('<td></td>');
                }
            }
        }
        
        $("#export_list").html($("#export_list").html() + "</table>");
    });
});