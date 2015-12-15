requirejs(['./config'], function() {
	requirejs(['js/site', 'app/navbar', 'app/rsvp-reply'], function(site, navbar, rsvpReply) {
        navbar();

        rsvpReply.bind(site);
        rsvpReply.load();
	});
});
