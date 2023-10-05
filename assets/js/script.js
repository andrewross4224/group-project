var weatherForcast;
// function to pull launch data from space devs


var launches = document.getElementById("launches")
function getLaunches() {
    var launchData = 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&lsp__name=Spacex'
        fetch(launchData)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
             console.log(data)
        })
}

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

getWeather();
// when the user clicks on launches nav link it will open a modal 
// launches.addEventListener.click(function() {
//     console.log(123)
//     var launchModal = $('#launchModal')
//         launchModal.style.display = "block";  
// })


launches.addEventListener("click", getLaunches);