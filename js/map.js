var restaurantList = [{
    name: "Futabuta",
    position: {
        lat: 35.215340,
        lng: -80.855395
    },
    genre: "Asian",
    show: true
}, {
    name: "Blaze Pizza",
    position: {
        lat: 35.212812,
        lng: -80.858871
    },
    genre: "Italian",
    show: true
}, {
    name: "Hot Taco",
    position: {
        lat: 35.216740,
        lng: -80.858839
    },
    genre: "Mexican",
    show: true
}, {
    name: "Seoul Food",
    position: {
        lat: 35.219258,
        lng: -80.857583
    },
    genre: "Korean",
    show: true
}, {
    name: "Mac's Speed Shop",
    position: {
        lat: 35.202947,
        lng: -80.864367
    },
    genre: "Barbecue",
    show: true
}, {
    name: "Sauceman's",
    position: {
        lat: 35.213986,
        lng: -80.861285
    },
    genre: "Barbecue",
    show: true
}, {
    name: "Phat Burrito",
    position: {
        lat: 35.214981,
        lng: -80.856628
    },
    genre: "Mexican",
    show: true
}, {
    name: "Pike's Old Fashioned Soda Shop",
    position: {
        lat: 35.210699,
        lng: -80.860697
    },
    genre: "American",
    show: true
}, {
    name: "Crispy Crepe",
    position: {
        lat: 35.214920,
        lng: -80.854695
    },
    genre: "American",
    show: true
}];

var viewModel = function() {
    var self = this;

    self.genreList = ko.observableArray();
    self.markers = ko.observableArray();
    self.currentFilter = ko.observable(""); // Initialize with an empty string

    var infowindow = new google.maps.InfoWindow();

    // marker creation
    for (i = 0; i < restaurantList.length; i++) {

        var marker = new google.maps.Marker({
            position: restaurantList[i].position,
            title: restaurantList[i].name,
            show: ko.observable(restaurantList[i].show),
            genre: restaurantList[i].genre,
            map: map
        });

        if (restaurantList[i].show) {
            self.markers.push(marker);
        }

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(restaurantList[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    };

    restaurantList.forEach(function(restaurant) {
        var genre = restaurant.genre;

        // Unique genres only
        if (!self.genreList().includes(genre)) {
            self.genreList.push(genre);
        }
    });

    // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.filteredMarkers = ko.computed(function() {
        var filter = self.currentFilter(); // Case insensitive search
        console.log('------------------');
        if (!filter || self.currentFilter === undefined) {
            return self.markers();
        } else {
            return ko.utils.arrayFilter(self.markers(), function(marker) {
                var genre = marker.genre.toLowerCase();
                var match = genre.indexOf(filter) !== -1;
                console.log(genre, filter, match);
                return match;
            });
        }
    });
};


ko.applyBindings(new viewModel());