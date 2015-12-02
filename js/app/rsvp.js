define(['jquery', 'knockout', 'app/navbar'], function($, ko, navbar) {
	function rsvpModel() {
		var model = {};

		model.givenName = ko.observable();
		model.familyName = ko.observable();
		model.submit = function() {
			$.get('/rsvp/invitees.json').done(function(invitees) {
				var fullName = model.givenName().trim() + ' ' + model.familyName().trim(),
					url = invitees[fullName];

				if (url) {
					window.location.href = url;
				} else {
					$('#rsvp-unknown-invitee').removeClass('hidden');
				}
			});
		}

		return model;
	}

	// setup the navbar
	navbar();

	ko.applyBindings(rsvpModel());
});