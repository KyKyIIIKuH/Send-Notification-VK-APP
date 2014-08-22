
$('#tist_timezone').on('change', function(){
    $.post(host_server, {
        action: "edit_time_zone",
        selecttimezone: $("#tist_timezone").val()
        }, function(data) {
                if(data.status == 0)
                {
                    app.showAlert("Изменение не могут быть сохранены!");
                    return;
                }
                
                params();
                list_send_load();
                load_visits_app();
            });
});

function params() {
    var gRCount = 0;
    
    $('#tist_timezone').children().remove();
    
    $("#tist_timezone").select2({
        placeholder: "Select a State",
        allowClear: true
    });
    
    $("#tist_timezone").append($('<option>', {value:"0", text: "Выберите часовой пояс", disabled: true}));
    
    $.post(host_server, {
        action: "load_time_zone"
        }, function(data) {
            if(data.status == 1)
            {
                gRCount = data.count;
                
                $("#your_timezone").text(data.your_timezone);
                setTimeout(function () { $("#tist_timezone").select2("val",data.your_timezone); },100);
                
                for (var i = 0; i < gRCount; i++) {
                    var title_timezone = data.response[i].timezone;
                    
                    $("#tist_timezone").append($('<option>', {value:title_timezone, text: title_timezone}));
                }
            }
            });
    
};
