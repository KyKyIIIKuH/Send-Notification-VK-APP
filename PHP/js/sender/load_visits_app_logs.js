function params(id, start) {
    $("#info_user_logs_list").html('<table class="table table-hover" id="info_user_logs_list"><thead><tr><th>#</th><th>Дата/Время посещения</th><th></th></tr></thead>');
    $("#info_user_logs_list").append('<tbody><tr></tr></tbody>');
    for(j=1;j<=1;j++) {
        $("#info_user_logs_list > tbody > tr:last").append('<td colspan="6"><p><center><img src="//vk.com/images/upload.gif"/></p></center></td>');
    }
    $("#info_user_logs_list").html($("#info_user_logs_list").html() + "</table>");
    
    var number_page = 15;
    
    $.post(host_server, {
        action: "load_visits_app_logs",
        app_id: $('#apps').val(),
        start: start,
        uid:id
    }, function (data){
        var grCount = data.count;
        
        load(id, 0);
        
        var url = "//ploader.ru/vkapp/sender/js/jquery.simplePagination.js";
        $.getScript( url, function() {
        $(function () {
            $(".paginator_user_logs").pagination('destroy');
            setTimeout(function() { 
                $(".paginator_user_logs").pagination({
                    items: grCount,
                    itemsOnPage: number_page,
                    cssStyle: 'light-theme',
                    onPageClick: function(pageNumber, event) {
                        var start = pageNumber * number_page - number_page;
                        load(id, start);
                    }
                });
            }, 100);
        });
        });
    });
}

function load(id, start) {
    $.post(host_server, {
        action: "load_visits_app_logs",
        app_id: $('#apps').val(),
        start: start,
        uid:id
    }, function (data){
        var grCount = data.count;
        
        $("#info_user_logs_list").html('<table class="table table-hover" id="info_user_logs_list"><thead><tr><th>#</th><th>Дата/Время посещения</th><th></th></thead>');
        
        if(grCount == 0)
        {
            $("#info_user_logs_list").append('<tbody><tr></tr></tbody>');
            for(j=1;j<=1;j++) {
                $("#info_user_logs_list > tbody > tr:last").append('<td colspan="6" align="center">Информация не найдена!</td>');
            }
        }
        
        var i_new = start;
        
        for (var i=0; i<grCount; i++) {
            if(data.response[i])
            {
                i_new++;
                
                var datetime_ = data.response[i].datetime;
                var browser_ = data.response[i].browser;
                
                $("#info_user_logs_list").append('<tbody><tr></tr></tbody>');
                for(j=1;j<=1;j++) {
                    $("#info_user_logs_list > tbody > tr:last").append('<td>' + i_new + '</td>');
                    $("#info_user_logs_list > tbody > tr:last").append('<td>'+datetime_+'</td>');
                    $("#info_user_logs_list > tbody > tr:last").append('<td>'+browser_+'</td>');
                }
            }
        }
        
        $("#info_user_logs_list").html($("#info_user_logs_list").html() + "</table>");
        
    });
}