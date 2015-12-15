requirejs(['./config'], function() {
	requirejs(['app/navbar'], function(navbar) {
        navbar();
	});
});
