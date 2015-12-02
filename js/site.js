---
---
define(function() {
	return {
		apikey: {
			google: '{{ site.apikey.google }}',
			typekit: '{{ site.apikey.typekit }}',
			aws: {
				access: '{{ site.apikey.aws.access }}',
				secret: '{{ site.apikey.aws.secret }}'
			}
		}
	}
});