
//Регистрируем посещения приложения
$.post("//ploader.ru/sender/api/load.html", {
    action: "set_visits_register"
}, function (data){
    console.log("[APP] Регистрация посещений успешно завершена!");
});