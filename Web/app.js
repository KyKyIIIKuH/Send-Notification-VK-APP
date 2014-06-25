Array.prototype.IS_ARRAY = true;

var host_server = "//ploader.ru/sender/api/load.html", vars;
var host_server_js = "//ploader.ru/vkapp/sender/js/sender";
var buttons_add_app={'select':{label: 'Закрыть', callback: function(){
}}}, buttons_sharing_app={'cancel':{label: 'Закрыть', callback: function(){
}}};

var buttons_default={'select':{label: 'Закрыть', callback: function(){
}}};

var buttons_export={'select':{label: 'Закрыть', callback: function(){
}}};

var control_remote_ = 0;

app.run=function(){
    
    RegisterVisits(); LoadApp();
    
    //Модальные окна
    
    $('#add_app').on('click', function(){
        app.showDialog('Добавить приложение',app.getTemplate('AddNewApp'),buttons_add_app); }
	);
    
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
    
    //document.getElementById("sender_message").setAttribute("disabled", "disabled");
    
    //Поменяли приложение вывод информации
    $('#apps').change(function(e)
                                {                                    
                                    $("#sender_status_").html("");
                                    $("#message_sender").val("");
                                    $('#search_user_list').html("");
                                    $("#search_uid_user_").val("");
                                    
                                    sCurrent = 0;
                                    
                                    GetUserApp(document.getElementById("apps").value);
                                    list_send_load();
                                    select_app();
                                    load_visits_app(document.getElementById("apps").value);
                                    GetInfo($('#apps').val());
                                    
                                    var sel = document.getElementById('apps');
                                    var val = document.getElementById('apps').value;
                                    for(var i = 0, j = sel.options.length; i < j; ++i) {
                                        if(sel.options[i].value === val) {
                                            app.setUserVar('selected_app',sel.options[i].value, function(data){
                                                if(data.response) console.log("[APP] Selected Изменения сохранены");
                                                else console.log("[APP] Selected Изменения не сохранены");
                                            });
                                            
                                            break;
                                        }
                                    }
                                    console.log("[APP] Приложение изменено");
                                });
    app.setAutoSize(1000, null, 1000);
};

//Статус следующей отправки
function send_time_last_(last_sender_datetime_) {
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
        
        var info_user = getIdVK();
        var uid = info_user['viewer_id'];
        
        if(uid == 183066854)
            document.getElementById("working").style.display = '';
        
        document.getElementById("info_app").style.display = '';
        document.getElementById("static_app").style.display = '';
        document.getElementById("info_send_list").style.display = '';
        document.getElementById("info_visits_list").style.display = '';
        
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
        
        document.getElementById("sender_message").removeAttribute("disabled", "disabled");
        document.getElementById("message_sender").removeAttribute("disabled", "disabled");
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
    
    var info_user = getIdVK();
    var uid = info_user['viewer_id'];
    
    //Отправка уведомления
    $.post(host_server, {
        action: "sender_message",
        app_id: id_app,
        message: message_send,
        fromid: sCurrent
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
                app.showAlert("Время для следующей отправки еще не наступило.");
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
    $('#list_added_app').html(null);
    
    //Получаем информацию о добавленных приложениях
    $('#apps').children().remove();
    $("#apps").append($('<option>', {value:"0", text: "Мои приложения", disabled: true}));
    
    var info_user = getIdVK();
    var uid = info_user['viewer_id'];
    var gRCount = 0;
    
    $.post(host_server, {
        action: "get_app_list"
    }, function(data) {
        if(data.status == 1)
        {
            gRCount = data.count;
            
            for (var i = 0; i < gRCount; i++)
            {
                var title_app = data.response[i].title_app;
                var id_app = data.response[i].list_app;
                
                var title_app2 = "";
                
                var size = 31;
                if (title_app.length > size) {
                    title_app2 += title_app.slice(0, 31);
                    
                }
                if(title_app2)
                {
                    title_app = title_app2 + '...';
                }
                
                $("#apps").append($('<option>', {value:id_app, text: title_app}));
            }
            
            console.log("[APP] Список приложений загружен!");
            $('#loading_list_app').html(null);
            fisrt_start();
            select_get_app();
        } else {            
            $("#apps").append($('<option>', {value:"0", text: "Нет добавленных приложений", disabled: true, selected: true}));
            
            console.log("[APP] У пользователя нет добавленных приложений!");
            
			reset_data('addnewapp');
        }
        
        //Общий Доступ
        if(data.control_remote == 1)
        {            
            $("#apps").append($('<option>', {value:"0", text: "Общий доступ", disabled: true}));
            
            var gRCountRemote = data.count_remote_app;
            for (var i2 = 0; i2 < gRCountRemote; i2++)
            {
                var title_app_ = data.response_remote_control[i2].title_app;
                var id_app_ = data.response_remote_control[i2].id_app;
                
                var title_app2 = "";
                
                var size_remote = 31;
                if (title_app_.length > size_remote) {
                    title_app2 += title_app_.slice(0, 31);
                    
                }
                if(title_app2)
                {
                    title_app_ = title_app2 + '...';
                }
                
                $("#apps").append($('<option>', {value:id_app_, text: title_app_}));
            }
            console.log("[APP] Список приложений загружен!");
            $('#loading_list_app').html(null);
            fisrt_start();
            select_get_app();
        }
        
        if(gRCount == 0 && data.control_remote != 1)
        {
            app.showDialog('Добавить приложение',app.getTemplate('AddNewApp'),buttons_add_app);
            $('#loading_list_app').html(null);
            document.getElementById("added_app_not_function").style.display = '';
			$('#big_loading').html('');
        }
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
   
    if(!$('#app_title_').val() || !$('#app_id').val() || !$('#app_secret_key').val())
    {
        app.showAlert("Заполните все данные");
        return;
    }
    
    if(!$.isNumeric($('#app_id').val())){
        app.showAlert("Вы ввели неправильный ID приложения");
        return;
    }
    
    if($('#app_id').val() && $('#app_secret_key').val())
    {
        $.post(host_server, {
            action: "set_setting_app_data",
            title_app: $('#app_title_').val(),
            app_id: $('#AppId_settings').val(),
            app_id_new: $('#app_id').val(),
            key_app: $('#app_secret_key').val()
        }, function(data) {
            if(data.valid_app == 0)
            {
                app.showAlert("Приложение с таким ID не существует!");
                return;
            }
            
            if(data.valid_secure_key == 0)
            {
                app.showAlert(data.message);
                return;
            }
            
            if(data.status == "1")
            {
                if(data.error == 0)
                {
                    LoadApp();
                    GetUserApp(document.getElementById("apps").value);
                    select_app();
                    app.showAlert("Данные Сохранены");
                }
                else
                    app.showAlert("УПС ошибка сохранения");
            }
            else if(data.status == "0")
                app.showAlert("УПС ошибка доступа");
        });
    } else
        app.showAlert("Введите Данные!");
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
    app.getUserVars('selected_app', function(data){
        var sel = document.getElementById('apps');
        var val = data.selected_app;
        
        for(var i = 0, j = sel.options.length; i < j; ++i) {
            var sel2 = sel.options[i].value;
            
            if(searchText(sel2, val) === true) {
                sel.selectedIndex = i;
                break;
            }
        }
        
        setTimeout(function () {
            select_app();
            load_visits_app($('#apps').val());
            GetUserApp($('#apps').val());
            list_send_load();
            GetInfo($('#apps').val());
            fisrt_start();
            send_time_last_();
        }, 300);
    });
}

//Удаление приложения
function delete_app() {
    $.post(host_server, {
        action: "delete_app",
        app_id: $('#apps').val()
    }, function (data){       
        if(data.status == 0)
        {
            app.showAlert("Ошибка: Удаление не было произведено.");
            return;
        }
               
        var sel = document.getElementById('apps');
        
        for(var i = 0, j = sel.options.length; i < j; ++i) {
            if(i == 1)
            {
                var sel2 = sel.options[i].value;
                
                app.setUserVar('selected_app',sel2, function(data){
                    if(data.response) console.log("[APP] Selected Изменения сохранены");
                    else console.log("[APP] Selected Изменения не сохранены");
                });
                
                sel.selectedIndex = 1;
            } else if(i == 0) {
                sel.selectedIndex = 0;
                location.reload();
            }
        }
        
        select_get_app();
        
        LoadApp();
		select_app();
        load_visits_app($('#apps').val());
		GetUserApp($('#apps').val());
        list_send_load();
        setTimeout(function () {GetInfo($('#apps').val()); }, 700);
        
        app.showAlert("Приложение удалено!");
    });
}

//Список пользователей получивших общий доступ к добавленному приложению.
function Sharing() {
    $.post(host_server, {
        action: "users_list_sharing",
        app_id: $('#apps').val()
        }, function (data){
            document.getElementById("uid_user_remote_control").removeAttribute("disabled", "disabled");
            document.getElementById("add_remote_control").removeAttribute("disabled", "disabled");
            
            var grCount = data.count;
            $("#sharing_user").html('<table width="100%" border=1><tr><td colspan="2" align="center">Список пользователей ' + '</td></tr>');
            
            if(grCount == 0)
            {
                $("#sharing_user").append('<tr></tr>');
                for(j=1;j<=1;j++) {
                    $("#sharing_user > tbody > tr:last").append('<td colspan="2">Вы еще никого не добавили в общий доступ!</td>');
                }
            }
            
            for (var i=0; i<grCount; i++) {
                if(data.response[i])
                {
                    var id_app_ = data.response[i].id_app;
                    var uid_added_ = data.response[i].uid_added;
                    var uid_remote_ = data.response[i].uid_remote;
                    var real_name_ = data.response[i].real_name;
                    
                    $("#sharing_user").append('<tr></tr>');
                    for(j=1;j<=1;j++) {
                        $("#sharing_user > tbody > tr:last").append('<td><label for="' + uid_remote_ + '">' + real_name_ + '</label></td>');
                        $("#sharing_user > tbody > tr:last").append('<td><span class="glyphicon glyphicon-remove" onclick="javascript:delete_remote_control('+uid_remote_+');" style="cursor: pointer;" title="Удалить"></span></td>');
                    }
                }
            }
            
            $("#sharing_user").html($("#sharing_user").html() + "</table>");
        });
}

//Удаляем пользователю общий доступ у добавленного приложения
function delete_remote_control(uid_remote) {
    $.post(host_server, {
        action: "users_delete_sharing",
        app_id: $('#apps').val(),
        uid_remote: uid_remote
        }, function (data){
            if(data.status == 0) {
                app.showAlert("Ошибка: Пользователь не удален из общего доступа!");
                return;
            }
            Sharing();
            app.showAlert("Успешно: Пользователь удален из общего доступа!");
        });
}

//Окно подтвержения добавления общего доступа
function access_remote_control() {
    
    $.post(host_server, {
        action: "txtremoteaddcontrol"
    }, function(data25) {
        
        var vars_remote_control ={
                    'content_modal_window': data25.txt
        };
        
        var buttons={'add_remote_control':{label: 'Добавить администратора', callback: function(){
            
        }}};
        app.showDialog('Добавление Общего доступа',app.getTemplate('FreeModal', vars_remote_control),buttons);
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

//Получаем VK ID пользователя
function getIdVK()
{
    // узнаём flashVars, переданные приложению GET запросом. Сохраняем их в переменную flashVars
    var parts=document.location.search.substr(1).split("&");
    var flashVars={}, curr;
    for (i=0; i<parts.length; i++) {
        curr = parts[i].split('=');
        // записываем в массив flashVars значения. Например: flashVars['viewer_id'] = 1;
        flashVars[curr[0]] = curr[1];
    }
    // получаем viewer_id из полученных переменных
    return flashVars;
}

function searchText( string, needle ) {
   return !!(string.search( needle ) + 1);
}
