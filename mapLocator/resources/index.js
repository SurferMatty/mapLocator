document.addEventListener('DOMContentLoaded', (event) => {
    //Sends the users coords and requests the map on load//
    window.navigator.geolocation
    .getCurrentPosition(fetchNewMap, console.log);

});

//Gets the map//
   const fetchNewMap = position => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    mymap = L.map('mapid').setView([latitude, longitude], 5);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3VyZmVybWF0dHkiLCJhIjoiY2tmZmNqNW5iMDJ4czJ5czVlb3d6NHE1MiJ9.LiizRcnyCW3sapN-bDONOQ'
    }).addTo(mymap);

    fetchMap(latitude, longitude);

   }

   //Gets the new location upon search request//
   const searchCountry = () => {
       const country = $('#dropDown').val();
       $.ajax({
           url: "resources/getCoords.php",
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

            mymap.setView([latitude, longitude], 5);

            featureGroup = L.featureGroup().addTo(mymap);

            popup = L.popup()
            .setLatLng([latitude, longitude])
            .addTo(featureGroup);

            $('.leaflet-popup-content').css("width", "300px");

        //API to get country name and weather//
        $.ajax({
            url: "resources/getCountry.php",
            type: "GET",
            dataType: "json",
            data: {
                lat: latitude,
                lon: longitude,
            },
            success: function(res){

                $('.leaflet-popup-content').append("Country: ", res['data']['country'][0]['components']['country'], "</br>");

                $('.leaflet-popup-content').append("Abbreviation: ", res['data']['country'][0]['components']['ISO_3166-1_alpha-2'], "</br>");

                $('.leaflet-popup-content').append("Weather: ", res['data']['weather'][0]['description'], "</br>");

                //API call to get extra info.//
                $.ajax({
                    url: "resources/getInfo.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        country: res['data']['country'][0]['components']['country_code'],
                    },
                    success: function(res){

                        $('.leaflet-popup-content').append("Continent: ", res['data'][0]['continent'], "</br>");

                        $('.leaflet-popup-content').append("Capital: ", res['data'][0]['capital'], "</br>");

                        $('.leaflet-popup-content').append("Population: ", res['data'][0]['population'], "</br>");

                        $('.leaflet-popup-content').append("Square Area: ", res['data'][0]['areaInSqKm'],"km</br>");

                        const imageSrc = res['data']['flag'];
                        $('.leaflet-popup-content').append("Flag:<br><img src=" + imageSrc + " style='width: 50px; height: 50px;'></br>");


                        //Gets the country border & creates the dropdown select menu//
                        $.ajax({
                            url: "resources/getBorder.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                countryCode: res['data'][0]['isoAlpha3'],
                            },
                            success: function(res){

                                geojson = res['border'];
                                border = L.geoJSON(geojson).addTo(mymap).addTo(featureGroup);

                                $.each(res['countries'], function(key, value) {
                                    $('#dropDown')
                                         .append($('<option>', { value : key })
                                         .text(value));
                               });

                            },

                            error: function(jqXHR, textStatus, error){
                                console.log(jqXHR);
                                console.log(textStatus);
                                console.log(error);
                            },

                        });

                        //API for Exchange Rate to USD//
                        $.ajax({
                            url: "resources/getExchange.php",
                            type: "GET",
                            dataType: "json",
                            data: {
                                code: res['data'][0]['currencyCode'],
                            },
                            success: function(res){
                                $('.leaflet-popup-content').append("Exchange Rate From USD: ", res['data'], "</br>");
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