requirejs(['./config'], function() {
	requirejs(['js/site', 'app/load-map', 'app/navbar', 'app/countdown'], function(site, loadMap, navbar, countdown) {
		navbar();

        countdown('.countdown-clock');

        loadMap.loadMap('#map', site);
	});
});
