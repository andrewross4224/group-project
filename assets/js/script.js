var weatherForecast;
var launchData;
var kennedy = [];
var ourLaunches = [];
var currentTime = dayjs().format("MM-DD-YYYY hh:mm:ss");
// function to pull launch data from space devs


var launches = document.getElementById("launches")
function getLaunches() {
    var launchUrl = 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&lsp__name=Spacex'
    fetch(launchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            launchData = data;
            locationFilter();
        })
}

function getWeather() {
    var weatherUrl = "http://api.weatherapi.com/v1/forecast.json?key=e0bee2c578604174b22235058230410&q=merritt island&days=14&aqi=no&alerts=no"
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weatherForecast = data;
        })
}

function locationFilter() {
    for (i = 0; i < launchData.results.length; i++) {
        if (launchData.results[i].pad.location.id === 12 || launchData.results[i].pad.location.id === 27) {
            kennedy.push(launchData.results[i]);
        }
    }
    timeCheck();
}

function timeCheck() {
    for (i = 0; i < 10; i++) {
        if (dayjs.utc(kennedy[i].net).format("MM-DD-YYYY hh:mm:ss") < currentTime) {
            // broken
            kennedy.splice(i, 0);
        } else {
            ourLaunches.push(kennedy[i]);
        }
    }
    launchWeather();
}

function launchWeather() {
    for (i = 0; i < ourLaunches.length; i++) {
        var current = dayjs.utc(ourLaunches[i].window_start).format("MM-DD-YYYY hh:mm")
        for (j = 0; j < 14; j++) {
            for (k = 0; k < 24; k++) {
                if (dayjs(weatherForecast.forecast.forecastday[j].hour[k].time).utc().format("MM-DD-YYYY hh:mm") === current) {
                    console.log(weatherForecast.forecast.forecastday[j].hour[k].time);
                }
            }
        }
    }
}
getWeather();
getLaunches();
// when the user clicks on launches nav link it will open a modal 
// launches.addEventListener.click(function() {
//     console.log(123)
//     var launchModal = $('#launchModal')
//         launchModal.style.display = "block";  
// })


launches.addEventListener("click", getLaunches);