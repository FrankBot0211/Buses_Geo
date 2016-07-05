angular.module('myapp', ['ionic', 'ngCordova'])

    .controller('MapCtrl', function ($scope, $ionicLoading, $compile, $interval, $http, $ionicPopover, $ionicSideMenuDelegate, $ionicModal, $cordovaFileTransfer, $cordovaFile) {
        $scope.toggleLeftSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };        
        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });
        $scope.login = function (user) {
            console.log('Sign-In', user);
        };
        $ionicModal.fromTemplateUrl('modal.html', function ($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });
        var GlobalJSONString = "";
        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }
            else {
                return CSV;
            };
            // for creating file in web app

            //Generate a file name
            //var fileName = "MyReport_";

            //this will remove the blank-spaces from the title and replace it with an underscore
            //fileName += ReportTitle.replace(/ /g, "_");

            //Initialize file format you want csv or xls
            //var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension    

            //this trick will generate a temp <a /> tag
            //var link = document.createElement("a");
            //link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            //link.style = "visibility:hidden";
            //link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            //document.body.appendChild(link);
            //link.click();
            //document.body.removeChild(link);
            //window.location.assign(uri);            
        };
        $scope.exportJson = function () {
            console.log("Convert staretd");
            $ionicLoading.show();
            // var urlString = 'http://112.78.3.114/api/ShuttleBus/' + $scope.busid;
            // a string of array of objects
            var JSONstring = "[" + GlobalJSONString.slice(0, -1) + "]";
            console.log(JSONstring);
            var dataReturned = JSONToCSVConvertor(JSONstring, "Bus_record", true); // ensure that the value returned is a string
            console.log(dataReturned);
        //    $cordovaFile.writeFile(cordova.file.externalRootDirectory, "Bus_record.csv", dataReturned, true)
        //        .then(function (success) {
        //            // success
        //            $scope.hasil = "success";
        //        }, function (error) {
        //            // error
        //            $scope.hasil = "error";
        //        });
        //    $cordovaFile.writeFile(cordova.file.dataDirectory, 'Bus_record.csv', dataReturned, { 'append': false }).then(function () {
        //        $scope.hasil = "ok";
        //    });
            console.log("conver complete");
            $ionicLoading.hide();
        };
        $scope.testWindowClick = function () {
            window.open("https://www.google.com.vn/");
        };
        function requestFirstPosition(busid) {
            var urlString = 'http://112.78.3.114/api/ShuttleBusesTrackings/' + busid;
            $http({
                method: 'GET',
                url: urlString,
            }).then(function successCallback(response) {
                var outcome = response.data;
                $scope.FirstLongitude = outcome.Latitude;
                $scope.FirstLatitude = outcome.Longitude;
            }, function errorCallback(error) {
                console.log(error);
            });
            var pt = new google.maps.LatLng($scope.FirstLatitude, $scope.FirstLongitude);
            return pt;
        };
        // bin
        $scope.userOpt = [{
            busID: 8,
            busName: 2.1,
            station: { rgLat: 0, rgLong: 0 },
            startpoint: { lat: 10.765520, long: 106.663017 },
            waypts: [{
                location: "Trường THPT Nguyễn Thị Minh Khai, Điện Biên Phủ, Hồ Chí Minh, Việt Nam",
                stopover: true
            }]
        }, {
            busID: 11,
            busName: 3.1,
            station: { rgLat: 0, rgLong: 0 },
            startpoint: { lat: 10.754569, long: 106.678333 },  // 1149 Trần Hưng Đạo, Q.5
            waypts: [{
                location: "657 Trần Hưng Đạo, Q.5",
                stopover: true
            }, {
                location: "Khách sạn Đại Nam, Trần Hưng Đạo, Hồ Chí Minh, Việt Nam",
                stopover: true
            }]
        }, {
            busID: 15,
            busName: 5.2,
            station: { rgLat: 0, rgLong: 0 },
            startpoint: { lat: 10.740539, long: 106.701000 },  // 470 Nguyễn Hữu Thọ, Tân Hưng, Hồ Chí Minh, Việt Nam
            waypts: [{
                location: "311 Hoang Dieu, Ho Chi Minh City, Ho Chi Minh, Vietnam",
                stopover: true
            }, {
                location: "Cantavil Premier, Xa lộ Hà Nội, Hồ Chí Minh, Việt Nam",
                stopover: true
            }]
        }];
        // specify innitial options
        // Intel location - fixed final location
        $scope.endpoint = { lat: 10.849746, long: 106.800098 };
        $scope.optionId = 0;
        $scope.busid = $scope.userOpt[$scope.optionId].busID;
        $scope.busName = $scope.userOpt[$scope.optionId].busName;
        var markers = [];
        $scope.waypts = $scope.userOpt[$scope.optionId].waypts;
        // Bin to display the current bus location, 1x1 array
        var currMarker = [];
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        // con tro chay currentMarker
        var i = 0;
        // Configure the rounte
        
        /////////////////////////
        // End of innitial options
        // Update these information when the user input new bus configuration
        /////////////////////////
        
        // reload this function to update new rount
        // update $scope.optionId to navigate to different selection
        $scope.changeBus = function (optIndex) {
            $scope.optionId = optIndex;
            $scope.busid = $scope.userOpt[optIndex].busID;
            $scope.busName = $scope.userOpt[optIndex].busName;
            $scope.waypts = $scope.userOpt[optIndex].waypts;
            markers = [];
            currMarker = [];
            i = 0;
            
            
            initialize();
            $scope.popover.hide();
        };
        function initialize() {
            // this function request new markers every 15 seconds
            // then push new marker to markers bin
            function requestPosition(busid) {
                var urlString = 'http://112.78.3.114/api/ShuttleBusesTrackings/' + busid;
                $http({
                    method: 'GET',
                    url: urlString,
                }).then(function successCallback(response) {
                    var outcome = response.data;
                    GlobalJSONString += JSON.stringify(outcome) + ",";
                    $scope.Longitude = outcome.Longitude;
                    $scope.Latitude = outcome.Latitude;
                    var newMarker = {
                        lat: $scope.Latitude,
                        long: $scope.Longitude
                    };
                    markers.push(newMarker);
                    console.log(markers.length);
                }, function errorCallback(error) {
                    console.log(error);
                });
            };
            function reloadMarkers() {
                // Get rid of the current marker
                requestPosition($scope.busid);
                for (var k = 0; k < currMarker.length; k++) {
                    currMarker[k].setMap(null);
                }
                currMarker.length = 0;
                // display the current marker
                createMarkers();
            };
            function createMarkers() {
                if (i <= markers.length - 1) {
                    var latLng = new google.maps.LatLng(markers[i].long, markers[i].lat);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        icon: iconBase + 'schools_maps.png'
                    });                    
                    currMarker.push(marker);
                    i += 1;                    
                }
                else {
                    i = 0;
                }
            };
            
            
            // Set map options
            
            
            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);
            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            // Execute this code every 15 seconds 
            // Before that, clear all time out first
            var highestTimeoutId = setTimeout(";");
            for (var i = 0 ; i < highestTimeoutId ; i++) {
                clearTimeout(i);
            }
            // then create new time out
            $interval(reloadMarkers, 2000);
            var site = new google.maps.LatLng($scope.userOpt[$scope.optionId].startpoint.lat, $scope.userOpt[$scope.optionId].startpoint.long);
            var intel = new google.maps.LatLng($scope.endpoint.lat, $scope.endpoint.long);
            var bus = requestFirstPosition($scope.busid);
            var mapOptions = {
                streetViewControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);
            $scope.map = map;
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var request = {
                origin: site,
                destination: intel,
                waypoints: $scope.waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });

            directionsDisplay.setMap(map);
            document.getElementById("centerOnMeBtn").addEventListener("click", function(){
                centerOnMe($scope.map);
            });
            document.getElementById("zoomToBusBtn").addEventListener("click", function () {
                zoomToBus($scope.map);
            });
        };
        // run the map with the default location
        // default bus is the bus id = 8, bus 2.1, userOpt[0]
        // reload this function to view diffrerent bus
        google.maps.event.addDomListener(window, 'load', initialize);
        var centerOnMe = function(map) {
            if (!map) {
                return;
            }
            $scope.loading = $ionicLoading.show({
                content: 'Getting your location...',
                showBackdrop: false
            });
            navigator.geolocation.getCurrentPosition(function (pos) {
				var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				map.setCenter(latLng);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map                    
                });
                map.setZoom(16);
                $ionicLoading.hide();
            }, function(error) {
                alert('Unable to get location: ' + error.message);
            });
        };
        var zoomToBus = function (map) {
            var bounds = new google.maps.LatLngBounds();
            var lastloc = (markers.length) - 1;
            var latLng = new google.maps.LatLng(markers[lastloc].long, markers[lastloc].lat);
            bounds.extend(latLng);
            map.setCenter(latLng);
            map.fitBounds(bounds);
            zoomChangeBoundsListener =
                google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
                if (this.getZoom()) {
                this.setZoom(15);
            }
    });
        };
    })

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        };
        if (window.StatusBar) {
            StatusBar.styleDefault();
        };
  });
})
