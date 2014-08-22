
$(function()
{
    $.post("//ploader.ru/vkapp/sender/vip.php", {
        action: "buy_vip"
    }, function (data){       
        if(data.bonus < 200)
        {
            app.showAlert("У вас недостаточно монет"); 
            return;
        }
        
        $('#coins').text(data.bonus_update);
        load_vip();
    });
    
});
