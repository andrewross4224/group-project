// empty global variables to make data accessable to all functions
var threeHour;
var weatherForecast;
var launchData;
var previousLaunchData;
var weatherHour = [];
var kennedy = [];
var ourLaunches = [];
var ourPreviousLaunches = [];
var forecast;
var threeHourChance;
var threeHourGust;
var threeHourClouds;
var threeHourVis;
var currentTime = dayjs().format("MM-DD-YYYY hh:mm:ss");
var index = 0
// function to pull launch data from space devs
var launches = document.getElementById("launches");
// get card classes to post data to page
var images = document.getElementsByClassName('card-img')
var spacecenter = document.getElementsByClassName("spacecenter")
var date = document.getElementsByClassName('date')
var time = document.getElementsByClassName('time')
// get modal to append forecast data
var dialog = $('#dialog')
// fetch for launch data
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
// fetch for past launches
function previousLaunches() {
    var previousUrl = 'https://lldev.thespacedevs.com/2.2.0/launch/previous/?limit=100&lsp__name=Spacex'
    fetch(previousUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            previousLaunchData = data;
            console.log(previousLaunchData)
            previousFilter();
        })
}
// fetch for weather forcast
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
// filter to only get launches from kennedy and cape canaveral
function locationFilter() {
    for (i = 0; i < launchData.results.length; i++) {
        if (launchData.results[i].pad.location.id === 12 || launchData.results[i].pad.location.id === 27) {
            kennedy.push(launchData.results[i]);
        }
    }
    timeCheck();
}
// filter to only get launches from kennedy that were successful
function previousFilter() {
    for (m = 0; m < previousLaunchData.results.length; m++) {
        if (previousLaunchData.results[m].status.id === 3 && previousLaunchData.results[m].pad.location.id === 12 || previousLaunchData.results[m].pad.location.id === 27) {
            ourPreviousLaunches.push(previousLaunchData.results[m]);
        }
    }
}
// broken time check function need to revisit
function timeCheck() {
    for (i = 0; i < 10; i++) {
        if (dayjs.utc(kennedy[i].net).format("MM-DD-YYYY hh:mm:ss") < currentTime) {
            // broken
            kennedy.splice(i, 0);
        } else {
            ourLaunches.push(kennedy[i]);
        }
    }
    weatherCheck();
}
// function to itterate through forcast based on launch date and time
function weatherCheck() {
    for (i = 0; i < ourLaunches.length; i++) {
        var launchDay = dayjs(ourLaunches[i].window_start).utc().utcOffset(-4).format("YYYY-MM-DD");
        var launchHour = dayjs(ourLaunches[i].window_start).utc().utcOffset(-4).format("YYYY-MM-DD HH:00");
        for (j = 0; j < 13; j++) {
            if (weatherForecast.forecast.forecastday[j].date === launchDay) {
                launchForecast = weatherForecast.forecast.forecastday[j];
                for (k = 0; k < 23; k++) {
                    if (launchForecast.hour[k].time === launchHour) {
                        threeHour = [launchForecast.hour[k], launchForecast.hour[k + 1], launchForecast.hour[k + 2]];
                        printtoPage();
                        weatherClip();
                    }
                }
            }
        }
    }
}
// function to set text content of cards to rocket launchpad and date
function printtoPage() {
    images[index].src = ourLaunches[index].image;
    spacecenter[index].textContent = ourLaunches[index].pad.name;
    date[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("dddd MMM D, YYYY");
    time[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("h:mm a");
    index += 1;
}
// get three hour window of forecast data 
function weatherClip() {
    for (m = 0; m < threeHour.length; m++) {
        threeHourChance = threeHour[m].chance_of_rain
        threeHourGust = threeHour[m].gust_mph
        threeHourClouds = threeHour[m].cloud
        threeHourVis = threeHour[m].vis_miles
        console.log(threeHour[m].chance_of_rain)
        console.log(threeHour[m].gust_mph)
        console.log(threeHour[m].cloud)
    }
}
// init page by running functions can be changed to buttons later
getWeather();
getLaunches();

// show forecast data for specific launch window
function showDialog() {
    dialog.show()
    $("#chanceDialog").text("Chance of rain:")
    $("#windDialog").text("Gust Speed:")
    $("#cloudDialog").text("Cloud Coverage:")
    $("#visDialog").text("Visibility:")
    $("#chanceDialog").append(" " + threeHourChance + "%")
    $("#windDialog").append(" " + threeHourGust + "mph")
    $("#cloudDialog").append(" " + threeHourClouds)
    $("#visDialog").append(" " + threeHourVis + "mi")
}
// hide the dialog box when go back is clicked
function hideDialog() {
    dialog.hide();
}