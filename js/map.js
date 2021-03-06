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
        lat: 35.216703,
        lng: -80.854397
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

//viewmodel start
var viewModel = function() {
    var self = this;
    self.genreList = ko.observableArray();
    self.markers = ko.observableArray();
    self.currentFilter = ko.observable(""); // Initialize with an empty string
    var infowindow = new google.maps.InfoWindow();
    var marker;
    var infowindows = [];
    self.zmtAddress;
    self.zmtThumb;
    self.infoWindowContent;
    self.zmtName;
    //creates map
    self.map = new google.maps.Map(document.getElementById('mapCanvas'), {
        center: {
            lat: 35.211698,
            lng: -80.857594
        },
        zoom: 15
    });
    //creates event listened for resizing events to ensure the map is responsive
    google.maps.event.addDomListener(window, "resize", function() {
        var center = self.map.getCenter();
        google.maps.event.trigger(self.map, "resize");
        self.map.setCenter(center);
    });
    // marker creation
    for (i = 0; i < restaurantList.length; i++) {
        var marker = new google.maps.Marker({
            position: restaurantList[i].position,
            title: restaurantList[i].title,
            show: ko.observable(restaurantList[i].show),
            genre: restaurantList[i].genre,
            icon: "images/nature-dog-bone-icons-4.png",
            animation: google.maps.Animation.DROP,
            map: self.map,
            id: restaurantList[i].id
        });
        if (restaurantList[i].show) {
            self.markers.push(marker);
        }
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                getZomatoInfo(marker.id); //makes ajax call to Zomato API using the restaurant's Zomato ID
                self.goToRestaurant(marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1400); //stops after two bounces
                infowindows.push(infowindow);
                infowindow.open(self.map, marker);
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
    //hides the markers of locations that didn't match the genre selected or shows the markers that did match
    self.hideUnselected = function(marker, match) {
        if (match === false) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
        self.closeInfoWindows();
    };
    //closes all infowindows when called
    self.closeInfoWindows = function() {
        for (var i = 0; i < infowindows.length; i++) {
            infowindows[i].close();
        }
    };
    //zooms to and opens infowindow of restaurant selected from the right nav
    self.goToRestaurant = function(clickedRestaurant) {
        clickedRestaurant.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            clickedRestaurant.setAnimation(null);
        }, 1400); //stops after two bounces
        for (i = 0; i < self.markers().length; i++) {
            if (clickedRestaurant.title === self.markers()[i].title) {
                getZomatoInfo(clickedRestaurant.id);
                self.map.panTo(self.markers()[i].position);
                self.map.setZoom(16);
                clickedRestaurant.setVisible(true);
                infowindow.open(self.map, self.markers()[i]);
            }
        }
    };
    // filters and unfilters based on selection in drop-down
    self.filteredMarkers = ko.computed(function() {
        var filter = self.currentFilter();
        if (!filter || self.currentFilter() === undefined) {
            for (i = 0; i < self.markers().length; i++) self.markers()[i].setVisible(
                true); //shows all markers again when 'All' is chosen from drop-down
            return self.markers();
        } else {
            self.map.panTo({
                lat: 35.211698,
                lng: -80.857594
            });
            self.map.setZoom(15);
            return self.markers().filter(function(marker) {
                var genre = marker.genre;
                var match = genre.indexOf(filter) !== -1;
                self.hideUnselected(marker, match);
                return match;
            });
        }
    });
    // calls Zomato async and put returned info into infowindow
    function getZomatoInfo(restaurantId) {
        var zomatoUrl =
            "https://developers.zomato.com/api/v2.1/restaurant?apikey=9f57bb53795b372e56c81c59706568ca&res_id=";
        var restId = restaurantId;
        $.ajax({
            url: zomatoUrl + restId,
            dataType: "jsonp"
        }).done(function(data) {
            self.zmtAddress = data.location.address;
            self.zmtCuisines = data.cuisines;
            self.zmtThumb = data.thumb;
            self.zmtName = data.name;
            self.infoWindowContent = '<div id = "restaurantThumb"><img src="' +
                self.zmtThumb + '"></div><div id= "infowindow"><span>' + self.zmtName +
                '<br></span>' + self.zmtAddress + '<br><em>' + self.zmtCuisines + '</em></div>';
            infowindow.setContent(self.infoWindowContent);
        }).fail(function() {
            alert("We couldn't reach Zomato right now. Please try again soon.");
        })
    };
};

function kickOff() {
    ko.applyBindings(new viewModel());
};

//specifies text of error in case of issue retrieveing data from Google Maps API
function googleError() {
    window.alert("There was an issue retrieving data from Google Maps. Please try again later.");
};