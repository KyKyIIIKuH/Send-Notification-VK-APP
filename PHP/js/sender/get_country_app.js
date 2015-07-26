
$(function()
{
    var app_id = $('#apps').val();
    
    $.post(host_server, {
        action: "get_country_app",
        app_id: app_id
    }, function(data) {
        app.showAlert(data);
        $(".loader_content").css("display", "none");
    });
});
