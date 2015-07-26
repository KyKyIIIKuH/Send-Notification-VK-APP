
$(function()
{
    $.post(host_server, {
        action: "load_list_send_",
        app_id: document.getElementById("apps").value
        }, function (data_list_send_){
            
            if(data_list_send_.error = "-4") {
                return;
            }
            
            if(data_list_send_.response_send[0]) {
                var days_timeout = data_list_send_.response_send[0].param0["days"];
                var hours_timeout = data_list_send_.response_send[0].param0["hours"];
                var min_timeout = data_list_send_.response_send[0].param0["min"];
                var sec_timeout = data_list_send_.response_send[0].param0["sec"];
                
                if(days_timeout == 0 && hours_timeout == 0 && min_timeout < 3) {
                    
                    if($("[name='sender_message']").attr('id') == "sender_message")
                    {
                        document.getElementById("sender_message").setAttribute("disabled", "disabled");
                        document.getElementById("sender_message").setAttribute("id", "block_sender");
                        console.log( " BLOCK SENDER " );
                    } else {
                        document.getElementById("block_sender").setAttribute("disabled", "disabled");
                    }
                    
                    $("[name='sender_message']").html("<span class=\"glyphicon glyphicon-envelope\"></span> Отправка будет доступа через <br/>"+  parseInt( 2 - min_timeout) + ":"+ parseInt(59 - sec_timeout) + " мин.");
                    
                    $.post(host_server, {
                        action: "status_autosend",
                        app_id: document.getElementById("apps").value
                        }, function (data){
                            if(data.message) {
                                document.getElementById("message_sender").setAttribute("disabled", "disabled");
                                $("#message_sender").val(data.message);
                            }
                            
                            if(data.progress) {
                                if(parseInt(data.progress) == 100 || parseInt(data.progress) == 99) {
                                    $("#sender_status_").html("<span style='color:green;'>Статус: Отправка уведомления завершена.</span>");
                                    $("#message_sender").val("");
                                    
                                    console.log("LOL");
                                    //document.getElementById("sender_uids_select").removeAttribute("disabled", "disabled");
                                }
                                else {
                                    $("#sender_status_").html("<span style='color:green;'>Статус: Начата отправка уведомления: </span> Завершено на: <span style='color:red;'>"+data.progress+"%</span>");
                                    document.getElementById("sender_uids_select").setAttribute("disabled", "disabled");
                                }
                                
                                $("#sender_status_").html($("#sender_status_").html() +
                                                          '<div class="progress progress-striped">' +
                                                          '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+data.progress+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data.progress+'%">'+
                                                          '<span class="sr-only">'+data.progress+'% Complete</span>' + 
                                                          '</div></div>');
                            }
                        });
                    
                } else {
                    if($("[name='sender_message']").attr('id') == "block_sender")
                        document.getElementById("block_sender").setAttribute("id", "sender_message");
                    
                    document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                    document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                    //$("#message_sender").html("");
//                    $("#sender_status_").html("");
                    
                    if(vk_valid_app == true) {
                        $("#info_app").css("display", "none");
                    } else {
                        $("#info_app").css("display", "inline");
                    }
                    
                    document.getElementById("sender_uids_select").removeAttribute("disabled", "disabled");
                    
                    $("[name='sender_message']").html("<span class=\"glyphicon glyphicon-envelope\"></span> Отправить");
                }
            } else {
                if($("[name='sender_message']").attr('id') == "block_sender")
                    document.getElementById("block_sender").setAttribute("id", "sender_message");
                
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                $("[name='sender_message']").html("<span class=\"glyphicon glyphicon-envelope\"></span> Отправить");
            }
            
            if(!data_list_send_.response[0]) {
                if(vk_valid_app == true) {
                    $("#info_app").css("display", "none");
                } else {
                    $("#info_app").css("display", "inline");
                }
            }
        });
});
