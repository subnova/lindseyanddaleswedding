define(['knockout', 'lodash', 'markdown'], function(ko, _, markdown) {
	function idAndLabel(id, label) {
		var model = {};

		model.id = id;
		model.label = label;

		return model;
	}

	function getRoomDescription(roomType) {
		switch (roomType) {
			case 'BRIDAL':
				return "The Bridal suite ~ £10000";
			case 'STANDARD':
				return "A double room - £100";
            case 'TWIN':
                return "A twin room - £100";
			case 'FAMILY':
				return "A Family room for 4 - £150";
            case 'ZBED':
                return "An additional Z-bed - £35";
            case 'COT':
                return "An additional cot - £0";
			case 'WAITING':
				return "Please add me to the waiting list for rooms - £100 if allocated";
			case 'NONE':
				return "No thanks, I'll make my own arrangements";
			default:
				return roomType;
		}
	}

	function buildGuestModel() {
		var model = {};

		model.name = ko.observable();
		model.attendChoices = ko.observableArray();
		model.attendChoice = ko.observable();
		model.dinnerChoices = ko.observableArray();
		model.dinnerChoice = ko.observable();
		model.dinnerInfo = ko.observable();
        model.transportChoices = ko.observableArray();
        model.transportChoice = ko.observable();

		return model;
	}

	function buildRoomModel() {
		var model = {};

		model.allocatedRooms = ko.observableArray();

		return model;
	}

	function buildFamilyModel() {
		var model = {};

		model.familyName = ko.observable();
		model.familyMessage = ko.observable();
		model.guests = ko.observableArray();
		model.accommodation = buildRoomModel();
		model.replyMessage = ko.observable();

		return model;
	}

	function populateAttendingFields(guestModel, guestType, attendingData) {
		switch (guestType) {
			case 'BRIDE_OR_GROOM':
				guestModel.attendChoices.push(idAndLabel("ACCEPT", "Will be getting married"));
				guestModel.attendChoices.push(idAndLabel("REJECT", "Sorry, the wedding's off!"));
				if (attendingData) {
					guestModel.attendChoice(attendingData);
				} else {
					guestModel.attendChoice('ACCEPT');
				}
				break;
			case 'DAY':
				guestModel.attendChoices.push(idAndLabel("ACCEPT", "Will be attending all day"));
				guestModel.attendChoices.push(idAndLabel("ACCEPT_EVENING", "Will be attending just for the evening"));
				guestModel.attendChoices.push(idAndLabel("REJECT", "Is sorry, but will not be able to attend"));
				if (attendingData) {
					guestModel.attendChoice(attendingData);
				} else {
					guestModel.attendChoice('ACCEPT');
				}
				break;
			case 'EVENING':
				guestModel.attendChoices.push(idAndLabel("ACCEPT_EVENING", "Will be attending for the evening"));
				guestModel.attendChoices.push(idAndLabel("REJECT", "Is sorry, but will not be able to attend"));
				if (attendingData) {
					guestModel.attendChoice(attendingData);
				} else {
					guestModel.attendChoice('ACCEPT_EVENING');
				}
				break;
            case 'BUMP':
                guestModel.attendChoices.push(idAndLabel("ACCEPT", "Will be attending if born"));
                guestModel.attendChoices.push(idAndLabel("REJECT", "Is sorry, but it's too soon for my 1st wedding"));
                if (attendingData) {
                    guestModel.attendChoice(attendingData);
                } else {
                    guestModel.attendChoice('ACCEPT');
                }
                break;
            case 'BUMP_PARENT':
                guestModel.attendChoices.push(idAndLabel("ACCEPT", "Will be attending the wedding (or the birthing room)"));
                guestModel.attendChoices.push(idAndLabel("REJECT", "Is sorry, but the timings just don't work"));
                if (attendingData) {
                    guestModel.attendChoice(attendingData);
                } else {
                    guestModel.attendChoice('ACCEPT');
                }
                break;
			default:
				console.log('Unknown guest type ' + guestType);
		}
	}

	function populateDinnerFields(guestModel, guestType, isChild, dinnerData) {
        if (guestType === 'BUMP') {
            guestModel.dinnerChoices.push(idAndLabel('BOOBY', 'Would like some of Mummy\'s milk or a nice bottle'));
        } else if (guestType !== 'EVENING') {
            if (isChild) {
                guestModel.dinnerChoices.push(idAndLabel('CHILDS', 'Would like a child\'s dinner'));
            }
            guestModel.dinnerChoices.push(idAndLabel('STANDARD', 'Would like the standard dinner'));
            guestModel.dinnerChoices.push(idAndLabel('VEGETARIAN', 'Would like the vegetarian dinner'));
            guestModel.dinnerChoices.push(idAndLabel('SPECIAL', 'Would like a dinner that corresponds to special dietary requirements'));
            if (dinnerData && dinnerData.type) {
                guestModel.dinnerChoice(dinnerData.type);
            } else if (isChild) {
                guestModel.dinnerChoice('CHILDS');
            } else {
                guestModel.dinnerChoice('STANDARD');
            }
		} else {
			guestModel.dinnerChoices.push(idAndLabel('STANDARD', 'Would like the standard supper'));
			guestModel.dinnerChoices.push(idAndLabel('VEGETARIAN', 'Would like the vegetarian supper'));
			if (dinnerData && dinnerData.type) {
				guestModel.dinnerChoice(dinnerData.type);
			} else {
				guestModel.dinnerChoice('STANDARD');
			}
		}

		if (dinnerData && dinnerData.info) {
			guestModel.dinnerInfo(dinnerData.info);
		}
	}

    function populateTransportFields(guestModel, guestData) {
        var busLabel = guestModel.name();
        if (guestData.child) {
            busLabel += ' £0 return';
        } else {
            busLabel += ' £15 return';
        }

        guestModel.transportChoices.push(idAndLabel('BUS', busLabel));
        guestModel.transportChoices.push(idAndLabel('NONE', 'No thanks, I\'ll make my own way'));
        guestModel.transportChoice(guestData.transport ? guestData.transport : 'BUS');
    }

	function populateGuestModel(guestModel, guestData) {
		guestModel.originalData = guestData;

		if (guestData.name && guestData.type) {
			guestModel.name(guestData.name);
			populateAttendingFields(guestModel, guestData.type, guestData.attending);
			populateDinnerFields(guestModel, guestData.type, guestData.child, guestData.dinner);
            populateTransportFields(guestModel, guestData);
		} else {
			console.log("Don't know guests name or type - can't render data");
		}
	}

	function populateRoomModel(roomModel, roomData) {
		roomModel.originalData = roomData;

        _.forEach(roomData, function(room) {
            var availableRoomModel = {};

            availableRoomModel.availableOptions = ko.observableArray();
            availableRoomModel.availableOptions.push(idAndLabel(room.type, getRoomDescription(room.type)));
            availableRoomModel.availableOptions.push(idAndLabel('NONE', getRoomDescription('NONE')));
            availableRoomModel.selectedOption = ko.observable(room.selected === true ? room.type : 'NONE');

			roomModel.allocatedRooms.push(availableRoomModel);
		});
	}

	function populateFamilyModel(familyModel, familyId, familyData) {
		familyModel.familyId = familyId;
		familyModel.originalData = familyData;

		if (familyData.title) {
			familyModel.familyName(familyData.title);
		}
		if (familyData.content) {
			familyModel.familyMessage(markdown.toHTML(familyData.content));
		}
		_.forEach(familyData.guests, function(guest) {
			var guestModel = buildGuestModel();
			populateGuestModel(guestModel, guest);
			familyModel.guests.push(guestModel);
		});
		if (familyData.rooms) {
			populateRoomModel(familyModel.accommodation, familyData.rooms);
		}
		if (familyData.message) {
			familyModel.replyMessage(familyData.message);
		}
	}

	function buildPersistenceModel(familyModel) {
		var model = {}, acceptedGuests = 0;

		model.title = familyModel.originalData.title;
		model.content = familyModel.originalData.content;
		model.guests = [];
		_.forEach(familyModel.guests(), function(guest) {
			var guestModel = {};

			guestModel.name = guest.originalData.name;
			guestModel.type = guest.originalData.type;
			guestModel.child = guest.originalData.child;
			guestModel.attending = guest.attendChoice();
            if (_.startsWith(guestModel.attending, 'ACCEPT')) {
                ++acceptedGuests;
                guestModel.dinner = {
                    type: guest.dinnerChoice(),
                    info: guest.dinnerInfo()
                };
                guestModel.transport = guest.transportChoice();
            }
			model.guests.push(guestModel);
		});
		model.rooms = [];
		_.forEach(familyModel.accommodation.allocatedRooms(), function(allocatedRoom) {
			var roomModel = {};

			roomModel.type = allocatedRoom.availableOptions()[0].id;
			roomModel.selected = acceptedGuests > 0 && _.contains(allocatedRoom.selectedOption(), roomModel.type);

			model.rooms.push(roomModel);
		});
        if (_.filter(model.rooms, function(room) {
                return room.selected === true &&
                    room.type !== 'NONE' &&
                    room.type !== 'WAITING'; }).length === model.rooms.length) {
            _.forEach(model.guests, function(guest) { guest.transport = 'NONE'; });
        }
		model.message = familyModel.replyMessage();

		return model;
	}

	return {
		buildFamilyModel: buildFamilyModel,
		populateFamilyModel: populateFamilyModel,
		buildPersistenceModel: buildPersistenceModel
	};
});
