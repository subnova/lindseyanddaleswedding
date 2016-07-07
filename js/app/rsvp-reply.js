define(['lodash', 'knockout', 'app/rsvp-model', 'app/rsvp-load', 'app/rsvp-save'], function(_, ko, rsvpModel, rsvpLoad, rsvpSave) {
    var rsvpReplyModel;

    function createRsvpReplyModel(site) {
		var model = rsvpModel.buildFamilyModel();

		model.populate = function(familyId, persistentModel) {
			rsvpModel.populateFamilyModel(model, familyId, persistentModel);
		};

        model.noAccommodation = function() {
            return _.filter(model.accommodation.allocatedRooms(), function(room) { return room.selectedOption() !== 'NONE' && room.selectedOption() !== 'WAITING'; }).length === 0;
        };

        model.attendingGuests = function() {
            return _.filter(model.guests(), function(guest) { return _.startsWith(guest.attendChoice(), 'ACCEPT'); });
        };

		model.rsvp = function() {
            var $success = $('.bg-success'),
                $error = $('.bg-warning');

            $success.addClass('hidden');
            $error.addClass('hidden');
			rsvpSave(site, model.familyId, rsvpModel.buildPersistenceModel(model))
			.done(function() {
                console.log("Saved OK");
                $success.removeClass('hidden');
				setTimeout(function() {
					window.location.pathname = "/";
				}, 3000);
			})
			.fail(function(msg) {
                console.log("Error: " + msg);
				$error.removeClass('hidden');
			});
		};

		return model;
	}

	return {
		bind: function(site) {
			rsvpReplyModel = createRsvpReplyModel(site);
			ko.applyBindings(rsvpReplyModel);
			return rsvpReplyModel;
		},

        load: function() {
            rsvpLoad(rsvpReplyModel.populate);
        }
	};
});
