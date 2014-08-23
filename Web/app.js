//Array.prototype.IS_ARRAY = true;

var host_server = "//ploader.ru/sender/api/load.html", vars;
var host_server_js = "//ploader.ru/vkapp/sender/js/sender";
var buttons_add_app={'select':{label: 'Закрыть', callback: function(){
}}}, buttons_sharing_app={'cancel':{label: 'Закрыть', callback: function(){
}}};

var buttons_default={'select':{label: 'Закрыть', callback: function(){
}}};

var buttons_export={'select':{label: 'Закрыть', callback: function(){
}}};

var buttons_vip={'cancel':{label: 'Отмена', callback: function(){
}},'buy':{label: 'Купить VIP', callback: function(){
    buy_vip();
}}};

var control_remote_ = 0;
var selected_user_send = [];
var selected_user_send_array = [];
var category_;
var gRCountAppUser = 0;

app.run=function(){
    RegisterVisits(); LoadApp();
    
    //Модальные окна
    
    $('#timezone_change').on('click', function(){
        list_timezone();
        app.showDialog('Изменение временной зоны',app.getTemplate('TimeZone'),buttons_default); }
	);
    
    $('#info_tags').on('click', function(){
        app.showDialog('Информация о тэгах',app.getTemplate('SendTags'),buttons_default); }
	);
    
    $('#add_app').on('click', function(){
        app.showDialog('Добавить приложение',app.getTemplate('AddNewApp'),buttons_add_app); }
	);
    
    $('#sender_uids_select').on('click', function(){
        app.showDialog('Выбираем кому отправить',app.getTemplate('SelectSendUser'),buttons_default);
        SelectSendUser("send_all_except");
    });
       
    $('#settings_app_').on('click', function(){
        if(control_remote_ == 0)
        {
            var buttons={'delete_app':{label: 'Удалить приложение', callback: function(){
                app.showConfirm("Вы точно хотите удалить приложение '" + $.trim(vars.app_title_) + "'?", function(result){
                    if(result == true)
                        delete_app();
                });
            }},'close':{label: 'Закрыть', callback: function(){
                
            }}};
            
            app.showDialog('Настройки приложения',app.getTemplate('SettingsApp', vars),buttons);
        } else
            app.showAlert("В Удалённом доступе запрещены настройки приложения.");
    });
    
    $('#code_add_your_app_').on('click', function(){
        var buttons={'select':{label: 'Закрыть', callback: function(){
        }}};
        app.showDialog('Код для вставки',app.getTemplate('CodeAddApp'),buttons); }
	);
    
    $('#loading_list_app').html("<p><img src='//vk.com/images/upload.gif'/></p>");
    
    $('#message_length').text(document.getElementById("message_sender").maxLength);
    
    //Поменяли приложение вывод информации
    $('#apps').change(function(e)
                                {
                                    $("#sender_status_").html("");
                                    $("#message_sender").val("");
                                    $('#search_user_list').html("");
                                    $("#search_uid_user_").val("");
                                    
                                    selected_user_send[0] = "";
                                    selected_user_send[1] = "";
                                    
                                    sCurrent = 0;
                                    
                                    GetUserApp(document.getElementById("apps").value);
                                    list_send_load();
                                    select_app();
                                    load_visits_app(document.getElementById("apps").value);
                                    GetInfo($('#apps').val());
                                    
                                    //Сохраняем изменения select app
                                    $.post(host_server, {
                                        action: "save_selecet_app",
                                        id_app: $('#apps').val()
                                        }, function (data){
                                            
                                            if(data.status == 0)
                                            {
                                                console.log("[APP] Selected Изменения не сохранены");
                                                return;
                                            }
                                            
                                            console.log("[APP] Selected Изменения сохранены");
                                        });
                                    console.log("[APP] Приложение изменено");
                                });
    
    setTimeout(function () {
        setInterval(function() {
            $("[rel='tooltip']").tooltip({
                
            });
        }, 1000);
    }, 300);
    
    app.setAutoSize(1000, null, 1000);
    
    $('#loader').fadeOut(4000, function () {  });
};

//Статус следующей отправки
function send_time_last_(last_sender_datetime_) {
    var url = host_server_js+"/send_time_last_.js?";
    $.getScript( url, function() {
        $(function () {
            params(last_sender_datetime_);
        });
    });
}

//Проверяем сколько осталось символов
$(function()
{
    var maxLength = $('#message_sender').attr('maxlength');        //(1)
    $('#message_sender').keyup(function()
    {
        var curLength = $('#message_sender').val().length;         //(2)
        $(this).val($(this).val().substr(0, maxLength));     //(3)
        var remaning = maxLength - curLength;
        if (remaning < 0) remaning = 0;
        $('#message_length').html(remaning); //(4)
    });
});

//Первый запуск выбор первого приложения в списке
function fisrt_start()
{
    $('#big_loading').html('<center><img src="//loader.pdata.ru//img/loading.gif" /></center>');
    
    if(document.getElementById("apps").value != 0)
    {
        $('#big_loading').html('');
        document.getElementById("added_app_not_function").style.display = 'none';
        
        document.getElementById("info_app").style.display = '';
        document.getElementById("static_app").style.display = '';
        document.getElementById("info_send_list").style.display = '';
        document.getElementById("info_visits_list").style.display = '';
        document.getElementById("timezone_change").style.display = '';
        
        console.log("[APP] Приложение загружено");
    }
}

//Отправка уведомления
var sCurrent = 0;

function sender_send() {
    
    var sFinish = parseInt($('#count_users_all').text());
    
    if(sFinish == 0) {
        app.showAlert("Уведомление не может быть отправлено, т.к в вашем приложении нету пользователей.");
        return false;
    }
    
    if (sFinish < sCurrent) {
        sCurrent = 0;
        
        $.post(host_server, {
            action: "set_sender_list",
            app_id: document.getElementById("apps").value,
            message: $('#message_sender').val()
        }, function(data) {});
        
        list_send_load();
        GetInfo(document.getElementById("apps").value);
        
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
        
        setTimeout(function () {
            document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        }, 10000);
        
        document.getElementById("apps").removeAttribute("disabled", "disabled");
        
        $("#sender_status_").html("<span style='color:green;'>Статус: Отправка уведомления завершена.</span>");
        $("#sender_status_").html($("#sender_status_").html() +
                                  '<div class="progress progress-striped">' +
                                  '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">'+
                                  '<span class="sr-only">100% Complete</span>' + 
                                  '</div></div>');
        return;
    }
    
    var id_app = document.getElementById("apps").value;
    var message_send = $('#message_sender').val();
    
    document.getElementById("sender_message").setAttribute("disabled", "disabled");
    document.getElementById("message_sender").setAttribute("disabled", "disabled");
    document.getElementById("apps").setAttribute("disabled", "disabled");
    
    if(!id_app)
    {
        document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
        document.getElementById("apps").removeAttribute("disabled", "disabled");
        app.showAlert("Вы не выбрали приложение.");
        return;
    }
    
    if(!message_send)
    {
        document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
        document.getElementById("apps").removeAttribute("disabled", "disabled");
        app.showAlert("Напишите сообщение для отправки уведомления.");
        return;
    }
    
    if(message_send.length < 10)
    {
        document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
        document.getElementById("apps").removeAttribute("disabled", "disabled");
        app.showAlert("Сообщение должно содержать более 10 символов.");
        return;
    }
    
    var userids = "";
    
    if(selected_user_send_array[0] != "")
    {
        category_ = 0;
        userids = selected_user_send[0];
    }
    
    if(selected_user_send_array[1] != "")
    {
        category_ = 1;
        userids = selected_user_send[1];
    }
    
    if(selected_user_send_array[0] == "" && selected_user_send_array[1] == "")
    {
        document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
        document.getElementById("apps").removeAttribute("disabled", "disabled");
        app.showAlert("Выберите один из методов отправки!");
        return;
    }
    
    if(userids)
        userids = userids.toString();
    else
        category_ = null;
    
    //Отправка уведомления
    $.post(host_server, {
        action: "sender_message",
        app_id: id_app,
        message: message_send,
        fromid: sCurrent,
        category: category_,
        userids: userids
    }, function(data) {
        if(data.status == 1)
        {
            var error = data.error;
            if(data.error == 1)
            {
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                 document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                document.getElementById("apps").removeAttribute("disabled", "disabled");
                app.showAlert("Уведомление не отправлено, приложение заблокировано или недоступно!");
            } else
            {
                console.log("TEST: " + data.test);
                
                var result_procent = ((sCurrent / sFinish * 100).toFixed(0));
                
                $("#sender_status_").html("<span style='color:green;'>Статус: Начата отправка уведомления: </span> Завершено на: <span style='color:red;'>"+result_procent+"%</span>");
                
                $("#sender_status_").html($("#sender_status_").html() +
                                         '<div class="progress progress-striped">' +
                                         '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+result_procent+'" aria-valuemin="0" aria-valuemax="100" style="width: '+result_procent+'%">'+
                                         '<span class="sr-only">'+result_procent+'% Complete</span>' + 
                                         '</div></div>');
                
                onAjaxSuccess();
            }
        }
        
        if(data.status == 0)
        {
            /*
            if(data.error == -78)
            {
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                document.getElementById("apps").removeAttribute("disabled", "disabled");
                app.showAlert("В данный момент идет 'Автоматическая отправка', ждите завершения!.");
                return;
            }
            */
            
            if(data.error == -9999)
            {
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                document.getElementById("apps").removeAttribute("disabled", "disabled");
                app.showAlert(data.message);
                return;
            }
            
            if(data.error == -2)
            {
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                document.getElementById("apps").removeAttribute("disabled", "disabled");
                app.showAlert("Вы исчерпали лимит Уведомлений на сегодняшний день.");
                return;
            }
            
            if(data.error == -3)
            {
                document.getElementById("sender_message").removeAttribute("disabled", "disabled");
                document.getElementById("message_sender").removeAttribute("disabled", "disabled");
                document.getElementById("apps").removeAttribute("disabled", "disabled");
                app.showAlert(data.message);
                return;
            }
            
            app.showAlert("Уведомление не отправлено.");
            
            document.getElementById("sender_message").removeAttribute("disabled", "disabled");
            document.getElementById("message_sender").removeAttribute("disabled", "disabled");
            document.getElementById("apps").removeAttribute("disabled", "disabled");
            return;
        }
    });
}

function onAjaxSuccess()
{
    var sPosition = sCurrent + 100;
    sCurrent = sPosition;
    setTimeout(sender_send, 1500);
}

//Выбрали приложение убираем блокировку с input полей
function select_app() {    
    document.getElementById("code_add_your_app_").style.display = '';
	$("#sender_status_").text("В данный момент уведомление будет отправлено всем пользователям!");
}

//Очистка
function reset_data(category)
{
    if(category == "addnewapp")
    {
        $('#title_app').val(null);
        $('#id_app').val(null);
        $('#key_app').val(null);
    }
    
    if(category == "settingapp")
    {
        $('#app_title_').val(null);
        $('#app_id').val(null);
        $('#app_secret_key').val(null);
    }
}

//Регистрация пользователей в приложении
function RegisterVisits() {    
    $.post(host_server, {
        action: "set_visits_register"
    }, function (data){
        console.log("[APP] Регистрация посещений успешно завершена!");
    });
}

//Добавляем новое приложение
function AddNewApp()
{
    var url = host_server_js+"/addnewapp.js?";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Загружаем список добавленных приложений
function LoadApp() {
    var url = host_server_js+"/LoadApp.js?";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Получаем список пользователей
function GetUserApp()
{
    var url = host_server_js+"/GetUserApp.js?";
    $.getScript( url, function() {
        $(function () {
            params(0);
        });
    });
}

//Сохранение данных
function SetInfo() {
    var url = host_server_js+"/SetInfo.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Получение данных о приложении
function GetInfo(app_id, category) {    
    var url = host_server_js+"/GetInfo.js?";
    $.getScript( url, function() {
        $(function () {
            params(app_id, category);
        });
    });
}

//Список отправленных уведомлений
function list_send_load(){
    var url = host_server_js+"/list_send_load.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Список посещений приложения
function load_visits_app() {
    var url = host_server_js+"/load_visits_app.js?";
    $.getScript( url, function() {
        $(function () {
            params(0);
        });
    });
}

//Выбираем последний Select приложений
function select_get_app() {
    var url = host_server_js+"/select_get_app.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Удаление приложения
function delete_app() {
    var url = host_server_js+"/delete_app.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Список пользователей получивших общий доступ к добавленному приложению.
function Sharing() {
    var url = host_server_js+"/Sharing.js?";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Удаляем пользователю общий доступ у добавленного приложения
function delete_remote_control(uid_remote) {
    var url = host_server_js+"/delete_remote_control.js?";
    $.getScript( url, function() {
        $(function () {
            params(uid_remote);
        });
    });
}

//Окно подтвержения добавления общего доступа
function access_remote_control() {
    var url = host_server_js+"/access_remote_control.js?";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Добавляем пользователю общий доступ к добавленному приложению
function add_Sharing_Remote_Control() {
    document.getElementById("add_remote_control").setAttribute("disabled", "disabled");
    if(!$('#uid_user_remote_control').val())
    {
        app.showAlert("Введите ссылку на страницу пользователя которому вы хотите предоставить общий доступ!");
        document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
        return;
    }
    
    var full_link = $('#uid_user_remote_control').val();
    var link;
    var uid_remote_control;
    
    if( full_link.indexOf('http://vk.com/') != -1 || full_link.indexOf('https://vk.com/') != -1 )
    {
        if( full_link.indexOf('http://vk.com/app') != -1 || full_link.indexOf('https://vk.com/app') != -1 )
        {
            app.showAlert("Вы указали неверную ссылку!");
            document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
            return false;
        }
        
        full_link = full_link.replace('https://vk.com/','http://vk.com/');
        link = full_link.replace('http://vk.com/', '');
        
        if( full_link.indexOf('http://vk.com/id') != -1) link = full_link.replace('http://vk.com/id', '');
        
		vkapi.users.get(
            {user_ids: link.toString()}, 
            function(data){
                uid_remote_control = data.response[0].uid;
            }
		);

    } else {
        app.showAlert("Вы указали неверную ссылку!");
        
        document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
        return false;
    }
    
    if(full_link == 'vk.com' || full_link == 'http://vk.com/' || full_link == 'http://vk.com' || link.indexOf('#/') != -1)
    {
        app.showAlert("Вы указали неверную ссылку!");
        document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
        return false;
    }
    
    //access_remote_control();
    //return;
    
    setTimeout(function() {
        $.post(host_server, {
            action: "users_add_sharing",
            app_id: $('#apps').val(),
            uid_added: uid_remote_control
            }, function (data){
                if(data.status == -2)
                {
                    app.showAlert(data.message);
                    document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
                    return;
                }
                
                if(data.status == -1)
                {
                    app.showAlert(data.message);
                    document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
                    return;
                }
                
                if(data.status == 0)
                {
                    app.showAlert(data.message);
                    document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
                    return;
                }
                Sharing();
                app.showAlert(data.message);
                document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
            });
    }, 500);
}

//Поиск пользователя
function search_user() {    
    var url = host_server_js+"/search_user.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Автоматическая отправка уведомлений
function autosendmessage() {
    var url = host_server_js+"/autosendmessage.js";
    $.getScript( url, function() {
        $(function () {
            $('#sender_auto_uids_select').on('click', function(){
                app.showDialog('Выбираем кому отправить',app.getTemplate('SelectSendUser'),buttons_default);
                SelectSendUser("send_all_except");
            });
        });
    });
}

//Добавляем задание
function autoaddaction() {
    var url = host_server_js+"/control_auto_send_data_.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Удаление задания автоматической отправки
function delete_action() {
    
}

//Узнаем название приложения
function title_app() {
    var id_app = document.getElementById("apps").value;
}

//Экспортирование данных
function Export() {
    setTimeout(function() {
        var url = host_server_js+"/export_.js";
        $.getScript( url, function() {
            $(function () {
                
            });
        });
    }, 400);
}

function Export_Add() {
    var url = host_server_js+"/export_add.js";
    $.getScript( url, function() {
        $(function () {
            
        });
    });
}

//Список выполняемых действий
function active_action_list() {
    
}

//Информация о уведомлении
function info_sender(id) {
    var url = host_server_js+"/info_sender.js?";
    $.getScript( url, function() {
        $(function () {
            params(id);
        });
    });
}

//SimplePaginator
function paginator_simple() {
    var url = host_server_js+"/simplePagination.js";
    $.getScript( url, function() {
        $(function () {
        });
    });
}

//Информация о уведомлении
function info_user_logs(id, start) {
    var url = host_server_js+"/load_visits_app_logs.js?";
    $.getScript( url, function() {
        $(function () {
            params(id, start);
        });
    });
}

//Импорт
function Import() {
    
}

//Удаление уведомления
function delete_sender(id_sender) {
    
}

//Выбираем кому отправить уведомление
function SelectSendUser() {
    var url = "//ploader.ru/vkapp/sender/js/select2/select2.js";
    $.getScript( url, function() {
        $(function () {
            var url = "//ploader.ru/vkapp/sender/js/select2/select2_locale_ru.js";
            $.getScript( url, function() {
                $(function () {
                    setTimeout(function () {
                        $('#e9').children().remove();
                        $('#e10').children().remove();
                        
                        $("#e9").select2({
                            placeholder: "Список пользователей"
                        });
                        
                        $("#e10").select2({
                            placeholder: "Список пользователей"
                        });
                        
                        var url = host_server_js+"/SelectSendUser.js?";
                        $.getScript( url, function() {
                            $(function () {
                                params();
                            });
                        });
                    }, 300);
                });
            });
        });
    });
}

//Список часовых поясов
function list_timezone() {    
    var url = "//ploader.ru/vkapp/sender/js/select2/select2.js";
    $.getScript( url, function() {
        $(function () {
            var url = "//ploader.ru/vkapp/sender/js/select2/select2_locale_ru.js";
            $.getScript( url, function() {
                $(function () {
                    var url = host_server_js+"/list_timezone.js";
                    $.getScript( url, function() {
                        $(function () {
                            params();
                            var refreshIntervalId = setInterval(function() {
                                $.post(host_server, {
                                    action: "datetime_load"
                                    }, function(data) {
                                        $("#timezone_time").text(data.datetime);
                                        
                                        if($("#tist_timezone").val() == undefined)
                                            clearInterval(refreshIntervalId);
                                    });
                            }, 1000);
                        });
                    });
                });
            });
        });
    });
}

function searchText( string, needle ) {
   return !!(string.search( needle ) + 1);
}
