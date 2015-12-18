define(['jquery', 'knockout'], function($, ko) {
	function createRsvpModel() {
		var model = {};

		model.givenName = ko.observable();
		model.familyName = ko.observable();
		model.submit = function() {
			$.get('/rsvp/invitees.json').done(function(invitees) {
				var givenName = model.givenName(),
                    familyName = model.familyName(),
                    fullName,
					url,
                    $rsvpNoName = $('#rsvp-no-name'),
                    $rsvpUnknownInvitee = $('#rsvp-unknown-invitee');

                $rsvpNoName.addClass('hidden');
                $rsvpUnknownInvitee.addClass('hidden');

                if (!givenName || !familyName) {
                    $rsvpNoName.removeClass('hidden');
                } else {
                    fullName = givenName.trim().toLowerCase() + ' ' + familyName.trim().toLowerCase();
                    url = invitees[fullName];

                    if (url) {
                        window.location.href = url;
                    } else {
                        $rsvpUnknownInvitee.removeClass('hidden');
                    }
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