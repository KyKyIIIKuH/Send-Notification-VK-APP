
$(function()
{
    $('#vip_box').html('Желающих нету');
    $.post("//ploader.ru/vkapp/sender/vip.php", {
        action: "load_vip"
    }, function (data){
        if(data.vip_users)
        {
            vkapi.users.get({uids: data.vip_users, fields: "photo_100", test_mode: true, https: 1}, 
                            function(data2){
                                $('#vip_box').html('');
                                var count = data2.response.length;
                                //Create and append the options
                                for (var i = 0; i < count; i++) {
                                    var vk_uid = data2.response[i].uid;
                                    var name = data2.response[i].first_name;
                                    var photo_100 = data2.response[i].photo_100;
                                    $('#vip_box').append('<p style="margin-bottom: 5px;"><img src="' + photo_100 + '" /></p><p><a href="http://vk.com/id' + vk_uid + '" target="_blank">' + name + '</a></p>');
                                }
                            });
        }
    });
    
});
