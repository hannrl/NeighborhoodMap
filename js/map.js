var restaurantList = [
    {
      name : "Futabuta",
      position: {lat: 35.215340, lng: -80.855395},
      genre : "Asian",
      show: true
    },
    {
      name : "Blaze Pizza",
      position: {lat: 35.212812, lng: -80.858871},
      genre : "Italian",
      show: true
    },
    {
      name : "Hot Taco",
      position: {lat: 35.216740, lng: -80.858839},
      genre : "Mexican",
      show: true
    },
    {
      name : "Seoul Food",
      position: {lat: 35.219258, lng: -80.857583},
      genre : "Korean",
      show: true
    },
    {
      name : "Mac's Speed Shop",
      position: {lat: 35.202947, lng: -80.864367},
      genre : "Barbecue",
      show: true
    },
    {
      name : "Sauceman's",
      position: {lat: 35.213986, lng: -80.861285},
      genre : "Barbecue",
      show: true
    },
    {
      name : "Phat Burrito",
      position: {lat: 35.214981, lng: -80.856628},
      genre : "Mexican",
      show: true
    },
    {
      name : "Pike's Old Fashioned Soda Shop",
      position: {lat: 35.210699, lng: -80.860697},
      genre : "American",
      show: true
    },
    {
      name : "Crispy Crepe",
      position: {lat: 35.214920, lng: -80.854695},
      genre : "American",
      show: true
    }
    ];



var viewModel = function() {

  var self = this;

  self.genreList = ko.observableArray();

  self.filteredList = ko.observableArray();

    for (i = 0; i < restaurantList.length; i++) {

      var marker = new google.maps.Marker({
          position: restaurantList[i].position,
          title: restaurantList[i].name,
          show: ko.observable(restaurantList[i].show),
          genre: ko.observable(restaurantList[i].genre),
          map: map
          });

      if (restaurantList[i].show) {
      self.filteredList.push(marker); }
    };

  self.currentFilter = ko.observable();

  self.applyFilter = function() {

    for (i = 0; i < self.filteredList.length; i++) {

      var genre = self.filteredList[i].genre;

      if (genre.localeCompare(self.currentFilter) === 0) {

      restaurantList[i] = true;
      } else {
      restaurantList[i] = false;
      }
      };
    console.log(ko.toJSON(self.currentFilter));
    console.log(ko.toJSON(self.filteredList));
  };

  for (i = 0; i < restaurantList.length; ++i) {

      var genre = restaurantList[i].genre;

        if (self.genreList.indexOf(genre) > -1) continue;
        self.genreList.push(genre);
  };
};


ko.applyBindings(new viewModel());