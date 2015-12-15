requirejs(['./config'], function() {
	requirejs(['app/rsvp', 'app/navbar'], function(rsvp, navbar) {
        navbar();

        rsvp.bind();
	});
});
