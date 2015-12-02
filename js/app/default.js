define(['jquery', 'google-maps', '../site', 'app/navbar'], function($, mapsLoader, site, navbar) {
	// setup the navbar
	navbar();

	mapsLoader.KEY = site.apikey.google;
	mapsLoader.SENSOR = false;

	mapsLoader.load(function(google) {
		var latlng = new google.maps.LatLng(53.36254845919025, -1.755019447111479),
			img = 'img/map-marker.png',
			map = new google.maps.Map($('#map')[0], {
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: latlng,
				scrollwheel: false,
				draggable: true,
				mapTypeControl: false
			}),
			beachMarker = new google.maps.Marker({
    	        position: latlng,
        	    map: map,
            	icon: img
            });
	});
});