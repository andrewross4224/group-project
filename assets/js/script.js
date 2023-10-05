var weatherForcast;
var launchData;
var kennedy = [];
// function to pull launch data from space devs


var launches = document.getElementById("launches")
function getLaunches() {
    var launchUrl = 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&lsp__name=Spacex'
    fetch(launchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            launchData = data
            locationFilter();
        })
}
getLaunches();
function getWeather() {
    var weatherUrl = "http://api.weatherapi.com/v1/forecast.json?key=e0bee2c578604174b22235058230410&q=merritt island&days=5&aqi=no&alerts=no"
    fetch(weatherUrl)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            weatherForcast = data
            console.log(weatherForcast);
        })
}

function locationFilter() {
    for (i = 0; i < launchData.results.length; i++) {
        if (launchData.results[i].pad.location.id === 12) {
            kennedy.push(launchData.results[i]);
        }
    }
console.log(kennedy)
}

getWeather();
// when the user clicks on launches nav link it will open a modal 
// launches.addEventListener.click(function() {
//     console.log(123)
//     var launchModal = $('#launchModal')
//         launchModal.style.display = "block";  
// })


launches.addEventListener("click", getLaunches);