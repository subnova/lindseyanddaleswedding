requirejs(['./config'], function() {
	requirejs(['js/site', 'app/load-map', 'app/navbar'], function(site, loadMap, navbar) {
		navbar();

        loadMap.loadMap('#map', site);
	});
});
