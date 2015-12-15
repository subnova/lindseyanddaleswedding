define(['jquery', 'lodash'], function($, _) {
    return function(populate) {
        var familyId = window.location.hash.substr(1);

        $.getJSON('/rsvp/status/' + familyId + ".json")
            .done(_.curry(populate)(familyId))
            .fail(function(msg) {
                console.log("Can't navigate " + JSON.stringify(msg));
            });
    };
});