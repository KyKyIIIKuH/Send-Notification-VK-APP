
$(document).ready(function(){
    register_visits();
});

//Регистрируем посещения приложения
function register_visits() {
    jQuery.ajax({
        type: "POST",
        url: "//ploader.ru/sender/api/load.html",
        data: { action: "set_visits_register"}
    });
}