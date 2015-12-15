define(['jquery', 'lodash', 'knockout', 'app/rsvp-reply', 'text!html/rsvp-reply.html'], function($, _, ko, rsvpReply, rsvpReplyHtml) {
	describe('the rsvp reply page', function() {
		var body,
		    rsvpReplyModel;

		beforeEach(function() { 
			body = $('body');
			body.empty();
			body.append(rsvpReplyHtml);
			rsvpReplyModel = rsvpReply.bind();
		});

		afterEach(function() {
			body.empty();
			ko.cleanNode(body[0]);
		});

		it('should render the family name on the page', function() {
			rsvpReplyModel.populate('family-id', {
				title: "The Family Title"
			});

			expect($('h2').text()).toEqual('RSVP for The Family Title');
		});

		it('should render the family message on the page based on markdown content', function() {
			rsvpReplyModel.populate('family-id', {
				content: "This is *not* a test"
			});

			expect($('.family-message').html()).toEqual("<p>This is <em>not</em> a test</p>");
		});

        it('should render questions for each guest', function() {
            var $guests,
                guestNames = ['Bob Smith', 'Sheila Snow Smith', 'Charlie Smith'];

            rsvpReplyModel.populate('family-id', {
                guests: [{
                    name: 'Bob Smith',
                    type: 'DAY'
                },{
                    name: 'Sheila Snow Smith',
                    type: 'DAY',
                    dinner: { type: 'SPECIAL', info: 'No nuts please' }
                },{
                    name: 'Charlie Smith',
                    type: 'DAY',
                    child: true
                }]
            });

            $guests = $('.guest:visible');

            expect($guests.length).toEqual(3);
            _.forEach($guests, function(guest, index) {
                var $guest = $(guest);

                expect($guest.find('.guest-name').text()).toEqual(guestNames[index]);
                expect($guest.find('select').length).toEqual(2);
                if (index === 1) {
                    expect($guest.find('textarea:visible').length).toEqual(1);
                } else {
                    expect($guest.find('textarea:visible').length).toEqual(0);
                }
            });
        });

        it('should render the accommodation options', function() {
            rsvpReplyModel.populate('family-id', {
                rooms: [{
                    type: 'STANDARD',
                    selected: true
                },{
                    type: 'FAMILY',
                    selected: false
                }]
            });

            expect($('.accommodation select').length).toEqual(1);
        });
	});
});