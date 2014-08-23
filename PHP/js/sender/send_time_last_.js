
function params(last_sender_datetime_) {
    var url = "//ploader.ru/vkapp/sender/js/countdown/jquery.plugin.js";
    $.getScript( url, function() {
        var url2 = "//ploader.ru/vkapp/sender/js/countdown/jquery.countdown.js";
        $.getScript( url2, function() {
            var url3 = "//ploader.ru/vkapp/sender/js/countdown/jquery.countdown-ru.js";
            $.getScript( url3, function() {
                $(function () {
                    if(last_sender_datetime_ != undefined)
                    {
                        $('#send_time_last').countdown('destroy'); 
                        var date_ = last_sender_datetime_.split('-');
                        var month = "0";
                        month += date_[1] - 1 ;
                        var space = date_[2].split(' ');
                        var time = space[1].split(':');
                        
                        var austDay = new Date();
                        austDay = new Date(date_[0],month,space[0],time[0], time[1], time[2]);
                        
                        $('#send_time_last').countdown({until: austDay, format: 'HMS', timezone: +4});
                        
                        setInterval(function() {
                            var finish_ = $('#send_time_last').text().split(':');
                            if(finish_[0] == "0" && finish_[1] == "0" && finish_[2] == "0") {
                                $('#send_time_last').countdown('destroy'); 
                                $('#send_time_last').html('<span class="label label-success"><b>Отправка разрешена!</b></span>');
                            }
                        }, 1000);
                    } else {
                        $('#send_time_last').countdown('destroy');
                        $('#send_time_last').html("<p><img src='//vk.com/images/upload.gif'/></p>");
                    }
                });
           	});
        });
    });
}
