define(['jquery'], function($) {
	return function(site, familyId, persistentModel) {
		var promise = $.Deferred();

		var s3;

		AWS.config.update({accessKeyId: site.apikey.aws.access, secretAccessKey: site.apikey.aws.secret });
		AWS.config.region = 'eu-west-1';

		s3 = new AWS.S3();

		s3.putObject({
			Bucket: 'lindseyanddaleswedding.co.uk', 
			Key: 'rsvp/status/' + familyId + '.json',
			Body: JSON.stringify(persistentModel),
			ContentType: "application/json"
		}).on('success', function(response) {
			promise.resolve();
		}).on('error', function(error, response) {
			promise.error(error);
		}).send();

		return promise;
	};
});