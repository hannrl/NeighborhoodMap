var restaurantList = [{
    title: "Futo Buta",
    position: {
        lat: 35.215340,
        lng: -80.855395
    },
    genre: "Japanese",
    show: true,
    id: 17740650
}, {
    title: "Blaze Pizza",
    position: {
        lat: 35.212812,
        lng: -80.858871
    },
    genre: "Italian",
    show: true,
    id: 17887677
}, {
    title: "Hot Taco",
    position: {
        lat: 35.216740,
        lng: -80.858839
    },
    genre: "Mexican",
    show: true,
    id: 17887638
}, {
    title: "Seoul Food",
    position: {
        lat: 35.219258,
        lng: -80.857583
    },
    genre: "Korean",
    show: true,
    id: 18274633
}, {
    title: "Mac's Speed Shop",
    position: {
        lat: 35.202947,
        lng: -80.864367
    },
    genre: "Barbecue",
    show: true,
    id: 17147666
}, {
    title: "Sauceman's",
    position: {
        lat: 35.213986,
        lng: -80.861285
    },
    genre: "Barbecue",
    show: true,
    id: 17150202
}, {
    title: "Phat Burrito",
    position: {
        lat: 35.214981,
        lng: -80.856628
    },
    genre: "Mexican",
    show: true,
    id: 17148613
}, {
    title: "Pike's Old Fashioned Soda Shop",
    position: {
        lat: 35.210699,
        lng: -80.860697
    },
    genre: "American",
    show: true,
    id: 17147968
}, {
    title: "Crispy Crepe",
    position: {
        lat: 35.214920,
        lng: -80.854695
    },
    genre: "French",
    show: true,
    id: 17150556
}];

var viewModel = function() {
        var self = this;

        self.genreList = ko.observableArray();
        self.markers = ko.observableArray();
        self.currentFilter = ko.observable(""); // Initialize with an empty string

        var infowindow = new google.maps.InfoWindow();

        var infowindows = [];

        // marker creation
        for (i = 0; i < restaurantList.length; i++) {

            var marker = new google.maps.Marker({
                position: restaurantList[i].position,
                title: restaurantList[i].title,
                show: ko.observable(restaurantList[i].show),
                genre: restaurantList[i].genre,
                map: map,
                id: restaurantList[i].id,
                content: ""
            });

            if (restaurantList[i].show) {
                self.markers.push(marker);
            }

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    getZomatoInfo(marker.id);
                    infowindow.setContent(marker.content);
                    infowindow.open(map, marker);
                    infowindows.push(infowindow);
                }
            })(marker, i));
        };

        restaurantList.forEach(function(restaurant) {
            var genre = restaurant.genre;

            // populates unique genres only
            if (!self.genreList().includes(genre)) {
                self.genreList.push(genre);
            }
        });




        // filters and unfilters based on selection in drop-down
        self.filteredMarkers = ko.computed(function() {
            map.panTo({
                lat: 35.211698,
                lng: -80.857594
            });
            map.setZoom(15);
            var filter = self.currentFilter();
            if (!filter || self.currentFilter() === undefined) {
                for (i = 0; i < self.markers().length; i++)
                    self.markers()[i].setVisible(true); //shows all markers again when 'All' is chosen from drop-down
                return self.markers();
            } else {
                return self.markers().filter(function(marker) {
                    var genre = marker.genre;
                    var match = genre.indexOf(filter) !== -1;
                    self.hideUnselected(marker, match);
                    return match;
                });


            }
        });
        //hides the markers of locations that didn't match the genre selected or shows the markers that did match
        self.hideUnselected = function(marker, match) {
            if (match === false) {
                marker.setVisible(false);
            } else {
                marker.setVisible(true);
            }
            self.closeInfoWindows();
        }

        //closes all infowindows when called
        self.closeInfoWindows = function() {
            console.log("Hannah");
            for (var i = 0; i < infowindows.length; i++) {
                infowindows[i].close();
            }
        }



        //resets map to original center
        self.centerMap = function() {
            map.panTo(new GLatLng(35.211698, -80.857594));
        }


        //zooms to and opens infowindow of restaurant selected from the right nav
        self.goToRestaurant = function(clickedRestaurant) {
            for (i = 0; i < self.markers().length; i++) {
                if (clickedRestaurant.title === self.markers()[i].title) {
                    map.panTo(self.markers()[i].position);
                    map.setZoom(18);
                    clickedRestaurant.setVisible(true);
                    infowindow.open(map, self.markers()[i]);
                    infowindow.setContent(self.markers()[i].content);
                }
            }
        };

        self.zmtInfo = [];

        function getZomatoInfo(restaurantId) {
            var zomatoUrl = "https://developers.zomato.com/api/v2.1/restaurant?apikey=9f57bb53795b372e56c81c59706568ca&res_id=";
            var restId = restaurantId;

            $.ajax({
                url: zomatoUrl + restId,
                dataType: 'json',
                success: function(data) {
                    var zmtAddress = data.location.address;
                    var zmtCost = data.average_cost_for_two;
                    var zmtThumb = data.thumb;
                }
            })

        }
}
        ko.applyBindings(new viewModel());