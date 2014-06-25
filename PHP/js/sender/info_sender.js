
function params(id) {
    $("#info_send_user_list").html('<table class="table table-hover" id="info_user_logs_list"><thead><tr><th>#</th><th></th></tr></thead>');
    $("#info_send_user_list").append('<tbody><tr></tr></tbody>');
    for(j=1;j<=1;j++) {
        $("#info_send_user_list > tbody > tr:last").append('<td colspan="2"><p><center><img src="//vk.com/images/upload.gif"/></p></center></td>');
    }
    $("#info_send_user_list").html($("#info_send_user_list").html() + "</table>");
    
    
    var number_page = 50;
    
    $.post(host_server, {
        action: "inform_select_send",
        app_id: document.getElementById("apps").value,
        send_id: id
        }, function(data) {
            var grCount = data.count;
            
            if(grCount == 0)
            {
                $("#info_send_user_list").html('<table class="table table-hover" id="info_send_user_list"><thead><tr><th>#</th><th></th></thead>');
                $("#info_send_user_list").append('<tbody><tr></tr></tbody>');
                for(j=1;j<=1;j++) {
                    $("#info_send_user_list > tbody > tr:last").append('<td colspan="2" align="center">Информация отсутвует!</td>');
                }
                $("#info_send_user_list").html($("#info_send_user_list").html() + "</table>");
            }
            
            load(id, 0, number_page);
            
            var url = "//ploader.ru/vkapp/sender/js/jquery.simplePagination.js";
            $.getScript( url, function() {
                $(function () {
                    $(".paginator_sender").pagination('destroy');
                    setTimeout(function() { 
                        $(".paginator_sender").pagination({
                            items: grCount,
                            itemsOnPage: number_page,
                            cssStyle: 'light-theme',
                            onPageClick: function(pageNumber, event) {
                                var start = pageNumber * number_page - number_page;
                                load(id, start, number_page);
                            }
                        });
                    }, 100);
                });
            });
        });
}

function load(id, start, number_page)
{
    $.post(host_server, {
        action: "inform_select_send",
        app_id: document.getElementById("apps").value,
        send_id: id,
        }, function(data) {
            var grCount = data.count;
            var grResult = data.userssend;
            var grTimeSend = data.time_send;
            console.log(grTimeSend);
            $("#time_send_").html("00:00:00");
            
            if(grResult) {
                
                $("#time_send_").html(grTimeSend);
                
                var arr_users = grResult.split(',');
                
                var new_limit = start + number_page;
                var i_new = start;
                
                var grResult2 = "";
                var symbol_ = "";
                
                for (var i_list=start; i_list<new_limit; i_list++) {
                    if(arr_users[i_list])
                    {
                        if (grResult2 !== "") {
                            symbol_ = ",";
                        }
                        
                        grResult2 = grResult2 + symbol_ + arr_users[i_list];
                    }
                }
                
                $("#info_send_user_list").html('<table class="table table-hover" id="info_send_user_list"><thead><tr><th>#</th><th></th></thead>');
                
                vkapi.users.get({user_ids: grResult2, v:"5.21"}, 
                    function(data_vk){
                        for (var i=0; i<grCount; i++) {
                            if(data_vk.response[i])
                            {
                                i_new++;
                                $("#info_send_user_list").append('<tbody><tr></tr></tbody>');
                                for(j=1;j<=1;j++) {
                                    $("#info_send_user_list > tbody > tr:last").append('<td>' + i_new + '</td>');
                                    $("#info_send_user_list > tbody > tr:last").append('<td><a href="//vk.com/id'+data_vk.response[i].id +'" target="_blank">'+data_vk.response[i].first_name + " " + data_vk.response[i].last_name + '</a><br/></td>');
                                }
                            }
                        }
                    });
            }
            $("#info_send_user_list").html($("#info_send_user_list").html() + "</table>");
    });
}