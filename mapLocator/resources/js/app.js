document.addEventListener('DOMContentLoaded', (event) => {
    //Sends the users coords and requests the map on load//
    window.navigator.geolocation
    .getCurrentPosition(fetchNewMap, console.log);

});

//Gets the map//
   const fetchNewMap = position => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

     satellite  = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3VyZmVybWF0dHkiLCJhIjoiY2tmZmNqNW5iMDJ4czJ5czVlb3d6NHE1MiJ9.LiizRcnyCW3sapN-bDONOQ'
     });

     streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3VyZmVybWF0dHkiLCJhIjoiY2tmZmNqNW5iMDJ4czJ5czVlb3d6NHE1MiJ9.LiizRcnyCW3sapN-bDONOQ'
    });

    mymap = L.map('mapid', {
        zoom: 5,
        layers: [streets, satellite]
    });

    
	var baseLayers = {
        "Satellite": satellite,
        "Streets": streets
	};

    L.control.layers(baseLayers).addTo(mymap);

    fetchMap(latitude, longitude);

   }

   //Gets the new location upon search request//
   const searchCountry = () => {
       const country = $('#dropDown').val();
       $.ajax({
           url: "resources/php/getCoords.php",
           type: "GET",
           dataType: "json",
           data: {
               countryName: country,
           },

           success: function(res){
                featureGroup.remove();

               fetchMap(res['coords']['lat'], res['coords']['lng']);

           }, error: function(jqXHR, textStatus, error){
                console.log(jqXHR);
                console.log(textStatus);
                console.log(error);
        },
       })
   }

   //Fetches the new location and info. when called, also sets the view.//
    const fetchMap = (latitude, longitude) => {

            featureGroup = L.featureGroup().addTo(mymap);


            
            marker = L.marker()
            .bindPopup()
            .setLatLng([latitude, longitude])
            .addTo(featureGroup);

            $('#markerContent').children('p').each(function () {
                $(this).html("");
            })

        //API to get country name and weather//
        $.ajax({
            url: "resources/php/getCountry.php",
            type: "GET",
            dataType: "json",
            data: {
                lat: latitude,
                lon: longitude,
            },
            success: function(res){

                $('#countryName').append("Country: ", res['data']['country'][0]['components']['country']);
                
                $countryCode = res['data']['country'][0]['components']['ISO_3166-1_alpha-2'];
                $('#abbreviation').append("Abbreviation: ", $countryCode);
                $('#dropDown').val($countryCode);

                $('#weather').append("Weather: ", res['data']['weather'][0]['description']);

                //API call to get extra info.//
                $.ajax({
                    url: "resources/php/getInfo.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        country: res['data']['country'][0]['components']['country_code'],
                    },
                    success: function(res){

                        $('#continent').append("Continent: ", res['data'][0]['continent']);

                        $('#capital').append("Capital: ", res['data'][0]['capital']);

                        $('#population').append("Population: ", res['data'][0]['population']);

                        $('#sqArea').append("Square Area: ", res['data'][0]['areaInSqKm'],"km<sup>2</sup>");

                        const imageSrc = res['data']['flag'];
                        $('#flag').append("Flag:<img src=" + imageSrc + " style='width: 50px; height: 50px;'>");


                        //Gets the country border & creates the dropdown select menu//
                        $.ajax({
                            url: "resources/php/getBorder.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                countryCode: res['data'][0]['isoAlpha3'],
                            },
                            success: function(res){

                                geojson = res['border'];
                                border = L.geoJSON(geojson).addTo(mymap).addTo(featureGroup);
                                mymap.fitBounds(border.getBounds());

                            },

                            error: function(jqXHR, textStatus, error){
                                console.log(jqXHR);
                                console.log(textStatus);
                                console.log(error);
                            },

                        });

                        //API for Exchange Rate to USD//
                        $.ajax({
                            url: "resources/php/getExchange.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                code: res['data'][0]['currencyCode'],
                            },
                            success: function(res){
                                $('#exchangeRate').append("Exchange Rate From USD: ", res['data']);
                                marker.setPopupContent($('#markerContent').html());
                                $('.loader-wrapper').remove();
                            },

                            error: function(jqXHR, textStatus, error){
                                console.log(jqXHR);
                                console.log(textStatus);
                                console.log(error);
                            },

                        });
                    },
                    error: function(jqXHR, textStatus, error){
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(error);
        
                    },
                });
            },
            error: function(jqXHR, textStatus, error){
                console.log(jqXHR);
                console.log(textStatus);
                console.log(error);

            },
        });
    }