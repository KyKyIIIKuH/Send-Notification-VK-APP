
var sCurrent_user = 0;
var count_page_ = 50;

$('#e9').on('change', function(){
    selected_user_send[0] = $("#e9").select2("val");
    
    if(selected_user_send[0].toString() == "")
        $("#sender_status_").text("В данный момент уведомление будет отправлено всем пользователям!");
    else
        $("#sender_status_").text("В данный момент уведомление будет отправлено всем кроме выбранных вами пользователями.");
});

$('#e10').on('change', function(){
    selected_user_send[1] = $("#e10").select2("val");
    
    if(selected_user_send[1].toString() == "")
        $("#sender_status_").text("В данный момент уведомление будет отправлено всем пользователям!");
    else
        $("#sender_status_").text("В данный момент уведомление будет отправлено только выбранным вами пользователям.");
});

function params() {
    
    var select_text = "";
    var symbol = "";
    
    selected_user_send[0] = $("#e9").select2("val");
    var count_data = $("#e9").select2("val").length;
    var data = $("#e9").select2("data");
    
    var array_select = [];
    
    if($("#e9").select2("data"))
    {
        for (var i = 0; i < count_data; i++)
        {
                if (select_text !== "") {
                    symbol = ",";
                }
                if(data[i].text != select_text)
                {
                    select_text = select_text + symbol + data[i].text;
                    array_select["id"] = "1";
                    array_select["text"] = "TEST";
                    
                }
        }
    }
    
    if(array_select.toString() != "")
        $("#e9").select2("data", [array_select]);    
    
    $.post(host_server, {
        action: "load_selected_send_user",
        app_id: $('#apps').val(),
        count_page: sCurrent_user
    }, function (data){
        var gRCount = data.count;
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
        
        for (var i = 0; i < gRCount; i++)
        {
            if(data.response[i])
            {
                var name_ = data.response[i].name;
                var id_vk_ = data.response[i].id_vk;
                
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
}

function onAjaxSuccess_selectload()
{
    var sPosition = sCurrent_user + count_page_;
    sCurrent_user = sPosition;
    setTimeout(params, 500);
}