/**
 * MV* Type of flow where the model never gets to communicate to the view directly.
 * The middleware (controller) is called hub in this example
 */
!(function(){

    /**
     * The MODEL of the application - responsible for storing the data.
     * @type {{
     *      init: Function,
     *      add: Function,
     *      remove: Function,
     *      getAllNotes: Function
     *  }}
     */
    var model = {
        // Create DB if not existing
        init: function(){
            if(!localStorage.notes){
                localStorage.notes = JSON.stringify([]);
            }

        },

        // Add new Note to the list
        add: function(obj){
            var data = JSON.parse(localStorage.notes);
            data.push(obj);
            localStorage.notes = JSON.stringify(data);
        },

        // Remove Note from the list
        remove: function(noteId){
            var data = JSON.parse(localStorage.notes);
            // Iterate over the list to find the note to be deleted.
            // This method will be different for different data schemas
            data.forEach(function(note){
                if(note.id === +noteId){
                    // If removing the last index
                    if(data.indexOf(note) === data.length - 1){
                        data.pop();
                    } else {
                        // Not efficient on large arrays
                        data.splice(data.indexOf(note), 1);
                    }
                }
            });
            // Save back the remaining notes
            localStorage.notes = JSON.stringify(data);
        },

        // Send all notes
        getAllNotes: function(){
            return JSON.parse(localStorage.notes);
        }
    };

    /**
     * The HUB/CONTROLLER of the application
     * Taking care of the communication between the MODEL and the VIEW
     * @type {{
     *      addNewNote: Function,
     *      deleteNote: Function,
     *      getNotes: Function,
     *      init: Function
     * }}
     */
    var hub = {

        // Initiate the model and the view
        init: function(){
            model.init();
            view.init();
            statusView.init();
            weatherView.init();
        },

        // Passes a new note from the view to the model
        addNewNote: function(note){
            var now = Date.now();

            if(note.length > 0){
                model.add({
                    content: note,
                    created: now,
                    id: now * 3
                });
            }
            view.render();
        },

        // Pass a note ID to be deleted form the DB
        deleteNote: function(noteId){
            if(noteId){
                model.remove(noteId);
                view.render();
            }
        },

        // Query the model for all data
        getNotes: function(){
            return model.getAllNotes().reverse();
        },

        getAppStatus: function(){
            return model && view;
        }

        //fetchExternal: function(){
        //
        //
        //}
    };

    /**
     * The VIEW/VIEWS of the application.
     * Manages all DOM manipulation and event binding code
     * @type {{
     *      init: Function,
     *      render: Function
     * }}
     */
    var view = {
        // Cache DOM elements and bind events
        init: function(){
            this.notesList = $('#notes');
            var newNoteForm = $('#new-note-form'),
                newNoteContent = $('#new-note-content');

            newNoteForm.on('submit', function(e){
                e.preventDefault();
                hub.addNewNote(newNoteContent.val());
                newNoteContent.val('');
            });

            this.notesList.on('click', '.delete-note', function(e){
                e.preventDefault();
                var _this = $(e.currentTarget),
                    parent = _this.closest('li'),
                    id = parent.attr('data-itemid');

                hub.deleteNote(id);
            });
            view.render();
        },

        // Renders the notes list on the screen
        render: function(){
            var htmlStr = '';
            hub.getNotes().forEach(function(item){
                htmlStr +=
                    '<li class="note-item" data-itemid="'+ item.id +'">' +
                        '<a href="#" class="delete-note">&#4030;</a>' +
                            item.content +
                        '<span>'+ new Date(item.created) +'</span>'+
                    '</li>';
            });
            this.notesList.html(htmlStr);
        }
    };

    // Just the status view
    var statusView = {
        init: function(){
            this.statusBar = $('#statusBar');
            var appStatus = hub.getAppStatus();
            statusView.render()
        },

        render: function(){
            var statusText;
            hub.getAppStatus ?  statusText = 'All systems functional' :  statusText = 'System malfunctioning...';
            this.statusBar.html(statusText);
        }

    };

    var weatherView = {
        init: function(){

            this.displayArea = $('#weather');
            this.location = this.displayArea.find('.location');
            this.map = this.displayArea.find('#map');
            this.render();
        },

        render: function(){

            //$.ajax({
            //    url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk",
            //    method: "GET",
            //    //async: false,
            //    dataType: 'jsonp'
            //}).done(function(data){
            //    console.log(data);
            //    drawMap(data);
            //});

            //function drawMap(data){
                //var myLatlng = new google.maps.LatLng(data.coord.lat, data.coord.lon);
                //var mapOptions = {
                //    center: myLatlng,
                //    zoom: 5,
                //    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]    };
                //var map = new google.maps.Map(document.getElementById('map'),
                //    mapOptions);
                //
                //var contentString = '<div id="content">'+
                //    '<div id="siteNotice">'+
                //    '</div>'+
                //    '<h1 id="firstHeading" class="firstHeading">Home</h1>'+
                //    '<div id="bodyContent">'+
                //    '<p><b>London, UK</b><br />'+
                //    'God save the queen!'+
                //    '</p>'+
                //    '</div>'+
                //    '</div>';
                //
                //var infowindow = new google.maps.InfoWindow({
                //    content: contentString
                //});
                //
                //var marker_london = new google.maps.Marker({
                //    position: myLatlng,
                //    map: map,
                //    title: 'Where I live now'
                //});
                //google.maps.event.addListener(marker_london, 'click', function() {
                //    infowindow.open(map,marker_london);
                //});

                var map;
                var geoJSON;
                var request;
                var gettingData = false;
                var openWeatherMapKey = "3bec42d12c011f0949a7f42fdd71f77c";
                function initialize() {
                    var mapOptions = {
                        zoom: 5,
                        center: new google.maps.LatLng(51.5072,-0.1275)
                    };
                    map = new google.maps.Map(document.getElementById('map'),
                        mapOptions);
                    // Add interaction listeners to make weather requests
                    google.maps.event.addListener(map, 'idle', checkIfDataRequested);
                    // Sets up and populates the info window with details
                    map.data.addListener('click', function(event) {
                        infowindow.setContent(
                            "<img src=" + event.feature.getProperty("icon") + ">"
                            + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
                            + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
                            + "<br />" + event.feature.getProperty("weather")
                        );
                        infowindow.setOptions({
                            position:{
                                lat: event.latLng.lat(),
                                lng: event.latLng.lng()
                            },
                            pixelOffset: {
                                width: 0,
                                height: -15
                            }
                        });
                        infowindow.open(map);

                        var widget = document.getElementById('forecast_embed'),
                            widgetParent = widget.parentNode;
                        widget.src = 'http://forecast.io/embed/#lat='+ event.latLng.lat() +'&lon='+ event.latLng.lng() +'&name=Downtown '+ event.feature.getProperty("city") +'&color=#00aaff&font=Georgia&units=uk';
                        widgetParent.removeChild(widget);
                        widgetParent.appendChild(widget);


                    });
                };
                var checkIfDataRequested = function() {
                    // Stop extra requests being sent
                    while (gettingData === true) {
                        request.abort();
                        gettingData = false;
                    }
                    getCoords();
                };
                // Get the coordinates from the Map bounds
                var getCoords = function() {
                    var bounds = map.getBounds();
                    var NE = bounds.getNorthEast();
                    var SW = bounds.getSouthWest();
                    getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
                };
                // Make the weather request
                var getWeather = function(northLat, eastLng, southLat, westLng) {
                    gettingData = true;
                    var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                        + westLng + "," + northLat + "," //left top
                        + eastLng + "," + southLat + "," //right bottom
                        + map.getZoom()
                        + "&cluster=yes&format=json"
                        + "&APPID=" + openWeatherMapKey;
                    request = new XMLHttpRequest();
                    request.onload = proccessResults;
                    request.open("get", requestString, true);
                    request.send();
                };
                // Take the JSON results and proccess them
                var proccessResults = function() {
                    console.log(this);
                    var results = JSON.parse(this.responseText);
                    if (results.list.length > 0) {
                        resetData();
                        for (var i = 0; i < results.list.length; i++) {
                            geoJSON.features.push(jsonToGeoJson(results.list[i]));
                        }
                        drawIcons(geoJSON);
                    }
                };
                var infowindow = new google.maps.InfoWindow();
                // For each result that comes back, convert the data to geoJSON
                var jsonToGeoJson = function (weatherItem) {
                    var feature = {
                        type: "Feature",
                        properties: {
                            city: weatherItem.name,
                            weather: weatherItem.weather[0].main,
                            temperature: weatherItem.main.temp,
                            min: weatherItem.main.temp_min,
                            max: weatherItem.main.temp_max,
                            humidity: weatherItem.main.humidity,
                            pressure: weatherItem.main.pressure,
                            windSpeed: weatherItem.wind.speed,
                            windDegrees: weatherItem.wind.deg,
                            windGust: weatherItem.wind.gust,
                            icon: "http://openweathermap.org/img/w/"
                            + weatherItem.weather[0].icon  + ".png",
                            coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
                        }
                    };
                    // Set the custom marker icon
                    map.data.setStyle(function(feature) {
                        return {
                            icon: {
                                url: feature.getProperty('icon'),
                                anchor: new google.maps.Point(25, 25)
                            }
                        };
                    });
                    // returns object
                    return feature;
                };
// Add the markers to the map
                var drawIcons = function (weather) {
                    map.data.addGeoJson(geoJSON);
                    // Set the flag to finished
                    gettingData = false;
                };
// Clear data layer and geoJSON
                var resetData = function () {
                    geoJSON = {
                        type: "FeatureCollection",
                        features: []
                    };
                    map.data.forEach(function(feature) {
                        map.data.remove(feature);
                    });
                };

                initialize();
            }
        };
    //};

    hub.init();

})();