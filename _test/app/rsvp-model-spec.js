define(['app/rsvp-model'], function(rsvpModel) {
	describe('building the family model', function() {
		it('should create the observable instances for each supported field', function() {
			var familyModel = rsvpModel.buildFamilyModel(); 

			expect(familyModel.hasOwnProperty('familyName')).toBeTruthy();
			expect(familyModel.hasOwnProperty('familyMessage')).toBeTruthy();
			expect(familyModel.hasOwnProperty('guests')).toBeTruthy();
			expect(familyModel.hasOwnProperty('accommodation')).toBeTruthy();
			expect(familyModel.hasOwnProperty('replyMessage')).toBeTruthy();
		});
	});

// {
// 	title: "Mr & Mrs Peakall",
// 	content: "We would like to *welcome* you to our Wedding",
// 	guests: [
// 	  {
// 	  	name: "Dale Peakall",
// 	  	type: 'BRIDE_OR_GROOM',
//      child: false,
// 	  	attending: 'ACCEPT'
// 	  	dinner:
// 	  	  type: 'STANDARD',
// 	  	  info: 'No nuts please'
//      transport: 'BUS'
// 	  }
// 	],
// 	rooms: [
// 	  {
// 	  	type: 'BRIDAL_SUITE',
// 	  	selected: true
// 	  }
// 	],
//  message: 'Thanks so much for inviting us.  We can't wait'
// }

	describe('populating the family model', function() {
		it('should set the family name, message and reply message', function() {
			var familyModel = rsvpModel.buildFamilyModel();
			rsvpModel.populateFamilyModel(familyModel, 'family-id', {
				title: "The Family Title",
				content: "The *Family* Message",
				message: "The Reply Message"
			});

			expect(familyModel.familyName()).toEqual('The Family Title');
			expect(familyModel.familyMessage()).toEqual('<p>The <em>Family</em> Message</p>');
			expect(familyModel.replyMessage()).toEqual('The Reply Message');
		});

		it('should set each guests name, attending options, attending choice, dinner options and dinner choice', function() {
			var familyModel = rsvpModel.buildFamilyModel(),
				guestA, guestB, guestC;

			rsvpModel.populateFamilyModel(familyModel, 'family-id', {
				guests: [{
					name: "Guest Name A",
					type: 'DAY',
					child: false,
					attending: 'REJECT',
					dinner: {
						type: 'SPECIAL',
						info: 'No nuts please'
					}
				},
				{
					name: "Guest Name B",
					type: 'EVENING'
				},
				{
					name: "Guest Name C",
					type: 'DAY',
					child: true,
					attending: 'ACCEPT'
				}]
			});

			expect(familyModel.guests().length).toEqual(3);

			guestA = familyModel.guests()[0];
			expect(guestA.name()).toEqual('Guest Name A');
			expect(guestA.attendChoices().length).toEqual(3);
			expect(guestA.attendChoices()).toContain({id:'ACCEPT', label:'Will be attending all day'});
			expect(guestA.attendChoices()).toContain({id:'ACCEPT_EVENING', label:'Will be attending just for the evening'});
			expect(guestA.attendChoices()).toContain({id:'REJECT', label:'Is sorry, but will not be able to attend'});
			expect(guestA.attendChoice()).toEqual('REJECT');
			expect(guestA.dinnerChoices().length).toEqual(3);
			expect(guestA.dinnerChoices()).toContain({id:'STANDARD', label:'Would like the standard dinner'});
			expect(guestA.dinnerChoices()).toContain({id:'VEGETARIAN', label:'Would like the vegetarian dinner'});
			expect(guestA.dinnerChoices()).toContain({id:'SPECIAL', label:'Would like a dinner that corresponds to special dietary requirements'});
			expect(guestA.dinnerChoice()).toEqual('SPECIAL');
			expect(guestA.dinnerInfo()).toEqual('No nuts please');

			guestB = familyModel.guests()[1];
			expect(guestB.name()).toEqual('Guest Name B');
			expect(guestB.attendChoices().length).toEqual(2);
			expect(guestB.attendChoices()).toContain({id:'ACCEPT_EVENING', label:'Will be attending for the evening'});
			expect(guestB.attendChoices()).toContain({id:'REJECT', label:'Is sorry, but will not be able to attend'});
			expect(guestB.attendChoice()).toEqual('ACCEPT_EVENING');
			expect(guestB.dinnerChoices().length).toEqual(2);
			expect(guestB.dinnerChoices()).toContain({id:'STANDARD', label:'Would like the standard supper'});
			expect(guestB.dinnerChoices()).toContain({id:'VEGETARIAN', label:'Would like the vegetarian supper'});
			expect(guestB.dinnerChoice()).toEqual('STANDARD');

			guestC = familyModel.guests()[2];
			expect(guestC.name()).toEqual('Guest Name C');
			expect(guestC.attendChoices().length).toEqual(3);
			expect(guestC.attendChoices()).toContain({id:'ACCEPT', label:'Will be attending all day'});
			expect(guestC.attendChoices()).toContain({id:'ACCEPT_EVENING', label:'Will be attending just for the evening'});
			expect(guestC.attendChoices()).toContain({id:'REJECT', label:'Is sorry, but will not be able to attend'});
			expect(guestC.attendChoice()).toEqual('ACCEPT');
			expect(guestC.dinnerChoices().length).toEqual(4);
			expect(guestC.dinnerChoices()).toContain({id:'CHILDS', label:'Would like a child\'s dinner'});
			expect(guestC.dinnerChoices()).toContain({id:'STANDARD', label:'Would like the standard dinner'});
			expect(guestC.dinnerChoices()).toContain({id:'VEGETARIAN', label:'Would like the vegetarian dinner'});
			expect(guestC.dinnerChoices()).toContain({id:'SPECIAL', label:'Would like a dinner that corresponds to special dietary requirements'});
			expect(guestC.dinnerChoice()).toEqual('CHILDS');
		});

		it('should set the allocated rooms and selections', function() {
			var familyModel = rsvpModel.buildFamilyModel();

			rsvpModel.populateFamilyModel(familyModel, 'family-id', {
				rooms: [{
					type: 'STANDARD',
					selected: false
				},
				{
					type: 'FAMILY',
					selected: true
				}]
			});

			expect(familyModel.accommodation.allocatedRooms().length).toEqual(2);
			expect(familyModel.accommodation.allocatedRooms()[0].availableOptions().length).toEqual(2);
			expect(familyModel.accommodation.allocatedRooms()[0].availableOptions()).toContain({id:'STANDARD', label:'A double room - £100'});
			expect(familyModel.accommodation.allocatedRooms()[0].availableOptions()).toContain({id:'NONE', label:'No thanks, I\'ll make my own arrangements'});
			expect(familyModel.accommodation.allocatedRooms()[1].availableOptions().length).toEqual(2);
			expect(familyModel.accommodation.allocatedRooms()[1].availableOptions()).toContain({id:'FAMILY', label:'A Family room for 4 - £150'});
			expect(familyModel.accommodation.allocatedRooms()[1].availableOptions()).toContain({id:'NONE', label:'No thanks, I\'ll make my own arrangements'});
			expect(familyModel.accommodation.allocatedRooms()[0].selectedOption()).toEqual('NONE');
			expect(familyModel.accommodation.allocatedRooms()[1].selectedOption()).toEqual('FAMILY');
		});
	});

	describe('building the persistence model', function() {
		it('should build the persistence model from the family model', function() {
			var familyModel = rsvpModel.buildFamilyModel(),
				persistenceModel;

			rsvpModel.populateFamilyModel(familyModel, 'family-id', {
				title: "The Family Title",
				content: "The *Family* Message",
				message: "The Reply Message",
				guests: [{
					name: "Guest Name A",
					type: 'DAY',
					child: false,
					attending: 'REJECT',
					dinner: {
						type: 'SPECIAL',
						info: 'No nuts please'
					}
				},
				{
					name: "Guest Name B",
					type: 'EVENING'
				},
				{
					name: "Guest Name C",
					type: 'DAY',
					child: true,
					attending: 'ACCEPT',
                    transport: 'BUS'
				}],
				rooms: [{
					type: 'STANDARD'
				},
				{
					type: 'FAMILY',
					selected: true
				}]
			});

			persistenceModel = rsvpModel.buildPersistenceModel(familyModel);

			expect(persistenceModel).toEqual({
				title: "The Family Title",
				content: "The *Family* Message",
				message: "The Reply Message",
				guests: [{
					name: "Guest Name A",
					type: 'DAY',
					child: false,
					attending: 'REJECT'
				},
				{
					name: "Guest Name B",
					type: 'EVENING',
					child: undefined,
					attending: 'ACCEPT_EVENING',
					dinner: {
						type: 'STANDARD',
						info: undefined
					},
                    transport: 'BUS'
				},
				{
					name: "Guest Name C",
					type: 'DAY',
					child: true,
					attending: 'ACCEPT',
					dinner: {
						type: 'CHILDS',
						info: undefined
					},
                    transport: 'BUS'
				}],
				rooms: [{
					type: 'STANDARD',
					selected: false
				},
				{
					type: 'FAMILY',
					selected: true
				}]
			});
		});
	});
});