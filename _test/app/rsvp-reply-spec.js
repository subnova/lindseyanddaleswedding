define(['jquery', 'app/rsvp-reply', 'text!html/rsvp-reply.html'], function($, rsvpReply, rsvpReplyHtml) {
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
		});

		it('should render the family name on the page', function() {
			rsvpReplyModel.populate('family-id', {
				title: "The Family Title"
			});

			expect($('h2').text()).toEqual('RSVP for The Family Title');
		});
	});
});