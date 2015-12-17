define(['jquery', 'knockout'], function($, ko) {
	function createRsvpModel() {
		var model = {};

		model.givenName = ko.observable();
		model.familyName = ko.observable();
		model.submit = function() {
			$.get('/rsvp/invitees.json').done(function(invitees) {
				var fullName = model.givenName().trim().toLowerCase() + ' ' + model.familyName().trim().toLowerCase(),
					url = invitees[fullName];

				if (url) {
					window.location.href = url;
				} else {
					$('#rsvp-unknown-invitee').removeClass('hidden');
				}
			});
		};

		return model;
	}

	return {
		bind: function() {
			var rsvpModel = createRsvpModel();
			ko.applyBindings(rsvpModel);
			return rsvpModel;
		}
	};
});