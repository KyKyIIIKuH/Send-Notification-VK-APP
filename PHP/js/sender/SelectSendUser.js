
var sCurrent_user = 0;
var count_page_ = 50;

$('#e9').on('change', function(){
    
    var url = "//ploader.ru/vkapp/sender/js/json/json2.js";
    $.getScript( url, function() {
        $(function () {
            $(document).ready(function () {
                var data_selected = $("#e9").select2("data");
                delete data_selected.element;
                
                var jsonString = JSON.stringify(data_selected, ["id"]);
                if(jsonString)
                {
                    selected_user_send_array[0] = jsonString;
                    selected_user_send[0] = $("#e9").val();
                }
                else
                {
                    selected_user_send_array[0] = "";
                    selected_user_send[0] = "";
                }
            });
        });
    });
    
    setTimeout(function () {
        if($("#e10").val())
        {
            if($("#e10").val().length > 0)
            {
                if(!$("#e9").val())
                    $("#sender_status_").text("В данный момент уведомление будет отправлено только выбранным вами пользователям.");
                
                return;
            }
        }
        
        if(selected_user_send_array[0].length < 5)
            $("#sender_status_").text("В данный момент уведомление будет отправлено всем пользователям!");
        else
            $("#sender_status_").text("В данный момент уведомление будет отправлено всем кроме выбранных вами пользователями.");
    }, 500);
});

$('#e10').on('change', function(){
    var url = "//ploader.ru/vkapp/sender/js/json/json2.js";
    $.getScript( url, function() {
        $(function () {
            $(document).ready(function () {                
                var data_selected = $("#e10").select2("data");
                delete data_selected.element;
                
                var jsonString = JSON.stringify(data_selected, ["id"]);
                if(jsonString)
                {
                    selected_user_send_array[1] = jsonString;
                    selected_user_send[1] = $("#e10").val();
                }
                else
                {
                    selected_user_send_array[1] = "";
                    selected_user_send[1] = "";
                }
            });
        });
    });
    
    setTimeout(function () {
        
        if($("#e9").val())
        {
            if($("#e9").val().length > 0)
            {
                if(!$("#e10").val())
                    $("#sender_status_").text("В данный момент уведомление будет отправлено всем кроме выбранных вами пользователями.");
                
                return;
            }
        }
        
        if(selected_user_send_array[1].length < 5)
            $("#sender_status_").text("В данный момент уведомление будет отправлено всем пользователям!");
        else
            $("#sender_status_").text("В данный момент уведомление будет отправлено только выбранным вами пользователям.");
    }, 500);
});

function params() {
    if(selected_user_send_array[0])
    {
        //E9
        var array_e9 = [];
        var post_e9 = [];
        
        var count_e9 = 0;
        var jsonData = JSON.parse(selected_user_send_array[0]);
        for (var i = 0; i < jsonData.length; i++) {
            count_e9++;
            var counter = jsonData[i];
            var data_id = counter.id;
            
            post_e9 = data_id;
            array_e9.push(post_e9);
        }
        
        if(array_e9)
            setTimeout(function () { $("#e9").select2("val",array_e9); },200);
    }
    
    if(selected_user_send_array[1])
    {
        //E10
        var array_e10 = [];
        var post_e10 = [];
        
        var count_e10 = 0;
        var jsonData = JSON.parse(selected_user_send_array[1]);
        for (var i = 0; i < jsonData.length; i++) {
            count_e10++;
            var counter = jsonData[i];
            var data_id = counter.id;
            
            post_e10 = data_id;
            array_e10.push(post_e10);
        }
        
        if(array_e10)
            setTimeout(function () { $("#e10").select2("val",array_e10); },200);
    }
    
    $.post(host_server, {
        action: "load_selected_send_user",
        app_id: $('#apps').val(),
        count_page: sCurrent_user
    }, function (data){
        var gRCount = data.count;
        var gRUsersUID = data.userids;
        
        var sFinish_select_load = gRCount;
        
        if (sFinish_select_load < sCurrent_user) {
            sCurrent_user = 0;
            $("#load_user").html("Загружено <span style='color:green;'>" + sFinish_select_load + "</span> из <span style='color:green;'>" + sFinish_select_load + "</span> пользователей");
            return;
        }
        
        if(count_page_ < sFinish_select_load)
            $("#load_user").html("Загружено <span style='color:green;'>" + sCurrent_user + "</span> из " + sFinish_select_load + " пользователей");
        else
            $("#load_user").html("Загружено <span style='color:green;'>" + sFinish_select_load + "</span> из <span style='color:green;'>" + sFinish_select_load + "</span> пользователей");
        
        vkapi.users.get({user_ids: gRUsersUID, v:5.24}, 
                        function(data_vk_users_get){
                            var grCount_vk = data_vk_users_get.response;
                            
                            for(i=0;i<=parseInt(grCount_vk.length);i++) {
                                if(data_vk_users_get.response[i]) {
                                    var name_ = data_vk_users_get.response[i].last_name +' ' + data_vk_users_get.response[i].first_name;
                                    var id_vk_ = data_vk_users_get.response[i].id;
                                    
                                     $("#e9").append($('<option>', {value:id_vk_, text: name_}));
                                     $("#e10").append($('<option>', {value:id_vk_, text: name_}));
                                }
                                else
                                {
                                    onAjaxSuccess_selectload();
                                    return;
                                }
                            }
                        });
    });
}

function onAjaxSuccess_selectload()
{
    var sPosition = sCurrent_user + count_page_;
    sCurrent_user = sPosition;
    setTimeout(params, 500);
}