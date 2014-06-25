$(function () {
    var all_page = 0;
    var number_page = 50;
    
    $.post(host_server, {
        action: "load_visits_app",
        app_id: $('#apps').val()
    }, function (data){
        all_page = data.all_page;
        
        var url = "//ploader.ru/vkapp/sender/js/jquery.simplePagination.js";
        $.getScript( url, function() {
            $(function () {
                $(".paginator").pagination('destroy');
                setTimeout(function() { 
                    $(".paginator").pagination({
                        items: all_page,
                        itemsOnPage: number_page,
                        cssStyle: 'light-theme',
                        onPageClick: function(pageNumber, event) {
                            var start = pageNumber * number_page - number_page;
                            
                            var url2 = "//ploader.ru/vkapp/sender/js/sender/load_visits_app.js?";
                            $.getScript( url2, function() {
                                $(function () {
                                    params(start);
                                });
                            });
                            
                            var url3 = "//ploader.ru/vkapp/sender/js/sender/GetUserApp.js?";
                            $.getScript( url3, function() {
                                $(function () {
                                    params(start);
                                });
                            });
                        }
                    });
                }, 100);
            });
        });
    });
});