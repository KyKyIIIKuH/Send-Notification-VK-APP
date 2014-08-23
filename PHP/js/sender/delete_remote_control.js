
function params(uid_remote) {
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
