define(['jquery', 'flipclock'], function($) {
    return function(cssSelector) {
        var currentDate = new Date(),
            weddingDate  = new Date(2016, 8, 6);

        // Calculate the difference in seconds between the future and current date
        var diff = weddingDate.getTime() / 1000 - currentDate.getTime() / 1000;

        // Instantiate a coutdown FlipClock
        clock = $(cssSelector).FlipClock(diff, {
            clockFace: 'DailyCounter',
            countdown: true
        });
    };
});