
$(function()
{
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
});
