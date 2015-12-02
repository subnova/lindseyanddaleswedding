define(['jquery', 'lodash', 'knockout', 'sammy', 'markdown', 'app/navbar'], function($, _, ko, sammy, markdown, navbar) {
	function idAndLabel(id, label) {
		var model = {};

		model.id = ko.observable(id);
		model.label = ko.observable(label);

		return model;
	}

	function guestModel(name, guestType, under15YearsOld) {
		var model = {};

		model.name = ko.observable(name);

		switch (guestType) {
			case 'BRIDE_OR_GROOM':
				model.attendChoices = ko.observableArray([
					idAndLabel("ACCEPT", "Will be getting married"),
					idAndLabel("REJECT", "Sorry, the wedding's off!")]);
				model.attendChoice = ko.observable('ACCEPT');
				break;
			case 'DAY':
				model.attendChoices = ko.observableArray([
					idAndLabel("ACCEPT", "Will be attending all day"),
					idAndLabel("ACCEPT_EVENING", "Will be attending just for the evening"),
					idAndLabel("REJECT", "Is sorry, but will not be able to attend")]);
				model.attendChoice = ko.observable('ACCEPT');
				break;
			case 'EVENING':
				model.attendChoices = ko.observableArray([
					idAndLabel("ACCEPT_EVENING", "Will be attending for the evening"),
					idAndLabel("REJECT", "Is sorry, but will not be able to attend")]);
				model.attendChoice = ko.observable('ACCEPT_EVENING');
				break;
			default:
				console.log('Unknown guestType ' + guestType);
		}

		model.dinnerChoices = ko.observableArray();
		if (guestType !== 'EVENING') {
			if (under15YearsOld) {
				model.dinnerChoices.push(idAndLabel('CHILDS', 'Would like a child\'s dinner'));
			} 
			model.dinnerChoices.push(idAndLabel('STANDARD', 'Would like the standard dinner'));
			model.dinnerChoices.push(idAndLabel('VEGETARIAN', 'Would like the vegetarian dinner'));
			model.dinnerChoices.push(idAndLabel('SPECIAL', 'Would like a dinner that corresponds to special dietary requirements'));
			if (under15YearsOld) {
				model.dinnerChoice = ko.observable('CHILDS');
			} else {
				model.dinnerChoice = ko.observable('STANDARD');
			}
		} else {
			model.dinnerChoices.push(idAndLabel('STANDARD', 'Would like the standard supper'));
			model.dinnerChoices.push(idAndLabel('VEGETARIAN', 'Would like the vegetarian supper'));
		}
		model.extraInfo = ko.observable();

		return model;
	}

	function getRoomDescription(roomType) {
		switch (roomType) {
			case 'BRIDAL':
				return "The Bridal suite";
			case 'STANDARD':
				return "A double room";
			case 'FAMILY':
				return "A Family room for 4";
			case 'TWO_STANDARD':
				return "Two double rooms";
			case 'WAITING':
				return "Please add me to the waiting list for rooms";
			default:
				return roomType;
		}
	}

	function rsvpReplyModel() {
		var model = {};
		model.familyName = ko.observable();
		model.familyMessage = ko.observable();
		model.guests = ko.observableArray();
		model.accommodationChoices = ko.observableArray();
		model.accommodationChoice = ko.observable();

		sammy(function() {
			this.get('#:familyId', function() {
				$.getJSON('/rsvp/status/' + this.params.familyId + ".json")
				.done(function(data) {
					model.familyName(data.title);
					model.familyMessage(markdown.toHTML(data.content));
					_.forEach(data.guests, function(guest) {
						model.guests.push(guestModel(guest.name, guest.type, guest.child));
					});
					_.forEach(data.rooms, function(room) {
						model.accommodationChoices.push(idAndLabel(room.type, getRoomDescription(room.type) + " - £" + room.cost));
					});
					model.accommodationChoices.push(idAndLabel('NONE', "No Thanks, we'll make our own accommodation arrangements"));
				})
				.fail(function(msg) {
					
				});
			});
		}).run();

		model.anyoneAccepted = function() {
			return _.filter(model.guests(), function(guest) { return guest.attendChoice()==='ACCEPT' || guest.attendChoice()==='ACCEPT_EVENING'; }).length > 0;
		}

		model.rsvp = function() {
			console.log(model);
		}

		return model;
	}

	// setup the navbar
	navbar();

	ko.applyBindings(rsvpReplyModel());
});