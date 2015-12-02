define(['jquery', 'jquery.easing', 'bootstrap-sass'], function($) {
    return function() {
        // jQuery to collapse the navbar on scroll
        $(window).scroll(function() {
            if ($(".navbar").offset().top > 50) {
                $(".navbar-fixed-top").addClass("top-nav-collapse");
            } else {
                $(".navbar-fixed-top").removeClass("top-nav-collapse");
            }
        });

        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $(function() {
            $('a.page-scroll').bind('click', function(event) {
                var $anchor = $(this),
                    $href = $($anchor.attr('href'));
                if ($href.offset()) {    
                    $('html, body').stop().animate({
                        scrollTop: $href.offset().top
                    }, 1500, 'easeInOutExpo');
                }
                event.preventDefault();
            });
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });
    };
});
