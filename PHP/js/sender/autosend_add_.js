$(function()
{
    //app.showAlert("Скрипт на техническом обслуживании.");
    //return;
    
    
    var useruids_auto_;
    var category_auto_;
    
    for(var i2 = 0; i2 < 1; i2++) {
        
        if(selected_user_auto_send[i2]) {
            if(selected_user_auto_send_array[i2] != undefined)
            {
                category_auto_ = i2;
                
                useruids_auto_ = selected_user_auto_send[i2];
                useruids_auto_ = useruids_auto_.toString();
            }
        }
    }
    
    $.post(host_server, {
        action: "datetime_load"
    }, function(data) {
        
        var datetime_real_user = new Date( data.datetime );
        
        var unixtime_real_user = humanToTime( datetime_real_user.getFullYear(), (parseInt(datetime_real_user.getMonth())+1), datetime_real_user.getDate(), datetime_real_user.getHours(), datetime_real_user.getMinutes(), 0 );
        console.log( "DDD " + unixtime_real_user);
        
        var datetime_select_add = $('#datetimepicker').val();
        var datetime_real_time = data.datetime;
        console.log( datetime_real_time );
        
        var param0 = datetime_select_add.split("-");
        var param1_min_sec = param0[2].split(":");
        var param2_hour = param1_min_sec[0].split(" ");
        
        var message_error = "[Ошибка] Выберите другую дату!<br/>Вы выбрали дату: " + datetime_select_add + "<br/>Сейчас: " + datetime_real_time;
        
        if(String(param0[0]+"-"+parseInt(param0[1])+"-"+param2_hour[0] + " " + param2_hour[1] + ":" + param1_min_sec[1]) == datetime_real_time) {
            app.showAlert(message_error);
            return;
        }
        
        var unixtime_select_time = humanToTime( param0[0], param0[1], param2_hour[0], param2_hour[1], param1_min_sec[1], 0 );
        
        if (unixtime_real_user <= unixtime_select_time) {
        }
        else {
            app.showAlert(message_error);
            return;
        }
        
        $.post(host_server, {
            action: "autosend_add_aсtions",
            app_id: document.getElementById("apps").value,
            message: $('#message_auto_sender').val(),
            datetime: $('#datetimepicker').val() + ":00",
            category: category_auto_,
            useruids: useruids_auto_
        }, function(data) {
            if(data.status == 0)
            {
                if(data.error)
                {
                    app.showAlert(data.message);
                    return;
                }
                
                app.showAlert("Задание не добавлено!");
                return;
            }
            
            //console.log(data.text);
            autosendmessage();
            app.showAlert("Задание добавлено!");
        });
    });
});