// empty global variables to make data accessable to all functions
var threeHour;
var weatherForecast;
var launchData;
var weatherHour = [];
var kennedy = [];
var ourLaunches = [];
var currentTime = dayjs().format("MM-DD-YYYY hh:mm:ss");
var index = 0
// function to pull launch data from space devs
var launches = document.getElementById("launches");
// get card classes to post data to page
var spacecenter =  document.getElementsByClassName("spacecenter")
var date = document.getElementsByClassName('date')
var time = document.getElementsByClassName('time')
// fetch for launch data

function getLaunches() {
    var launchUrl = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&lsp__name=Spacex'
    fetch(launchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            launchData = data;
            locationFilter();
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
        for (j = 0; j < 14; j++) {
            if (weatherForecast.forecast.forecastday[j].date === launchDay) {
                launchForcast = weatherForecast.forecast.forecastday[j]
                for (k = 0; k < 24; k++) {
                    if(launchForcast.hour[k].time === launchHour){
                        threeHour = [launchForcast.hour[k],launchForcast.hour[k+1],launchForcast.hour[k+2]]
                        // what data do we want from the weather at that time
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
    // append()
    spacecenter[index].textContent = ourLaunches[index].pad.name;
    date[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("YYYY-MM-DD");
    time[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("h:mm a");
    index +=1;
}

function weatherClip() {
    console.log(threeHour);
    for(m=0;m<threeHour.length;m++) {
        console.log(threeHour[m].chance_of_rain)
        console.log(threeHour[m].gust_mph)
        console.log(threeHour[m].cloud)
    }
}
// init page by running functions can be changed to buttons later
getWeather();
getLaunches();
