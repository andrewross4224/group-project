// empty global variables to make data accessable to all functions
var threeHour;
var weatherForecast;
var launchData;
var previousLaunchData;
var weatherHour = [];
var kennedy = [];
var ourLaunches = [];
var ourPreviousLaunches = [];
var threeHourChance = [];
var threeHourGust = [];
var threeHourClouds = [];
var threeHourVis = [];
var currentTime = dayjs().format("MM-DD-YYYY hh:mm:ss");
var index = 0
// function to pull launch data from space devs
var launches = document.getElementById("launches");
// get card classes to post data to page
var images = document.getElementsByClassName('card-img')
var spaceCraft = document.getElementsByClassName('spaceCraft')
var spacecenter = document.getElementsByClassName("spacecenter")
var date = document.getElementsByClassName('date')
var time = document.getElementsByClassName('time')
var previousSpaceCraft = document.getElementsByClassName('previousSpaceCraft')
var previousLocation = document.getElementsByClassName('previousLocation')
var previousDate = document.getElementsByClassName('previousDate')
// get modal to append forecast data
var button1 = $('#button1')
var button2 = $('#button2')
var button3 = $('#button3')
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
            previousFilter();
        })
}
// fetch for weather forcast
function getWeather() {
    var weatherUrl = "https://api.weatherapi.com/v1/forecast.json?key=7b6f17cc0bc342308ba200624231810&q=merritt island&days=14&aqi=no&alerts=no"
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
    recentLaunches();
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
    buttonData();
}
// function to set text content of cards to rocket launchpad and date
function printtoPage() {
    images[index].src = ourLaunches[index].image;
    spacecenter[index].textContent = ourLaunches[index].pad.name;
    spaceCraft[index].textContent = ourLaunches[index].rocket.configuration.full_name;
    date[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("dddd MMM D, YYYY");
    time[index].textContent = dayjs(ourLaunches[index].window_start).utc().utcOffset(-4).format("h:mm a");
    index += 1;
    $('#loader').hide();
}

// function to iterate through 3 most recent launches and post data 
function recentLaunches() {
    for (o = 0; o < previousLocation.length; o++) {
        previousLocation[o].textContent = ourPreviousLaunches[o].pad.name;
        previousSpaceCraft[o].textContent = ourPreviousLaunches[o].rocket.configuration.full_name;
        previousDate[o].textContent = dayjs(ourPreviousLaunches[o].net).utc().utcOffset(-4).format("dddd MMM D, YYYY");
    }
}
// get three hour window of forecast data 
function weatherClip() {
    for (m = 0; m < threeHour.length; m++) {
        threeHourChance.push(threeHour[m].chance_of_rain)
        threeHourGust.push(threeHour[m].gust_mph)
        threeHourClouds.push(threeHour[m].cloud)
        threeHourVis.push(threeHour[m].vis_miles)
    }
}
function buttonData() {
    if (threeHourChance[0] === undefined) {
        button1.attr("disabled", true)
    }
    if (threeHourChance[3] === undefined) {
        button2.attr("disabled", true)
    }
    if (threeHourChance[6] === undefined) {
        button3.attr("disabled", true)
    }
}
// user search function
function userSearch(input) {
    $("#userLocation").text("No launches for " + dayjs(input).format("MM-DD-YYYY"))
    $("#userSpaceCraft").text("")
    $("#userDate").text("")
    $("#missionText").text("")
    $("#missionDescription").text("")
    for (u = 0; u < ourPreviousLaunches.length -1; u++) {
        if (input === dayjs(ourPreviousLaunches[u].net).utc().utcOffset(-4).format("YYYY-MM-DD")) {
            $("#userLocation").text(ourPreviousLaunches[u].pad.name)
            $("#userSpaceCraft").text(ourPreviousLaunches[u].rocket.configuration.full_name)
            $("#userDate").text(dayjs(ourPreviousLaunches[u].net).utc().utcOffset(-4).format("dddd MMM D, YYYY"))
            $("#missionText").text("Mission Description")
            $("#missionDescription").text(ourPreviousLaunches[u].mission.description)
        }
    }
}
// show forecast data for specific launch window in modal
function showDialog() {
    let dialog = document.getElementById('dialog');
    dialog.classList.remove('hidden');
    setTimeout(() => {
        dialog.classList.remove('opacity-0');
    }, 20);
}
// hide the dialog box when go back is clicked
function hideDialog() {
    let dialog = document.getElementById('dialog');
    dialog.classList.add('opacity-0');
    setTimeout(() => {
        dialog.classList.add('hidden');
    }, 500);
}

button1.on('click', function () {
    $("#hour1").text(dayjs(ourLaunches[0].window_start).utc().utcOffset(-4).format("h a"))
    $("#chanceDialog1").text("Chance of rain: " + threeHourChance[0] + "%")
    $("#windDialog1").text("Gust Speed: " + threeHourGust[0] + " mph")
    $("#cloudDialog1").text("Cloud Coverage: " + threeHourClouds[0] + "%")
    $("#visDialog1").text("Visibility: " + threeHourVis[0] + " mi")
    $("#hour2").text(dayjs(ourLaunches[0].window_start).utc().utcOffset(-4).add(1, 'h').format("h a"))
    $("#chanceDialog2").text("Chance of rain: " + threeHourChance[1] + "%")
    $("#windDialog2").text("Gust Speed: " + threeHourGust[1] + " mph")
    $("#cloudDialog2").text("Cloud Coverage: " + threeHourClouds[1] + "%")
    $("#visDialog2").text("Visibility: " + threeHourVis[1] + " mi")
    $("#hour3").text(dayjs(ourLaunches[0].window_start).utc().utcOffset(-4).add(2, 'h').format("h a"))
    $("#chanceDialog3").text("Chance of rain: " + threeHourChance[2] + "%")
    $("#windDialog3").text("Gust Speed: " + threeHourGust[2] + " mph")
    $("#cloudDialog3").text("Cloud Coverage: " + threeHourClouds[2] + "%")
    $("#visDialog3").text("Visibility: " + threeHourVis[2] + " mi")
})

button2.on('click', function () {
    $("#hour1").text(dayjs(ourLaunches[1].window_start).utc().utcOffset(-4).format("h a"))
    $("#chanceDialog1").text("Chance of rain: " + threeHourChance[3] + "%")
    $("#windDialog1").text("Gust Speed: " + threeHourGust[3] + " mph")
    $("#cloudDialog1").text("Cloud Coverage: " + threeHourClouds[3] + "%")
    $("#visDialog1").text("Visibility: " + threeHourVis[3] + " mi")
    $("#hour2").text(dayjs(ourLaunches[1].window_start).utc().utcOffset(-4).add(1, 'h').format("h a"))
    $("#chanceDialog2").text("Chance of rain: " + threeHourChance[4] + "%")
    $("#windDialog2").text("Gust Speed: " + threeHourGust[4] + " mph")
    $("#cloudDialog2").text("Cloud Coverage: " + threeHourClouds[4] + "%")
    $("#visDialog2").text("Visibility: " + threeHourVis[4] + " mi")
    $("#hour3").text(dayjs(ourLaunches[1].window_start).utc().utcOffset(-4).add(2, 'h').format("h a"))
    $("#chanceDialog3").text("Chance of rain: " + threeHourChance[5] + "%")
    $("#windDialog3").text("Gust Speed: " + threeHourGust[5] + " mph")
    $("#cloudDialog3").text("Cloud Coverage: " + threeHourClouds[5] + "%")
    $("#visDialog3").text("Visibility: " + threeHourVis[5] + " mi")
})

button3.on('click', function () {
    $("#hour1").text(dayjs(ourLaunches[2].window_start).utc().utcOffset(-4).format("h a"))
    $("#chanceDialog1").text("Chance of rain: " + threeHourChance[6] + "%")
    $("#windDialog1").text("Gust Speed: " + threeHourGust[6] + " mph")
    $("#cloudDialog1").text("Cloud Coverage: " + threeHourClouds[6] + "%")
    $("#visDialog1").text("Visibility: " + threeHourVis[6] + " mi")
    $("#hour2").text(dayjs(ourLaunches[2].window_start).utc().utcOffset(-4).add(1, 'h').format("h a"))
    $("#chanceDialog2").text("Chance of rain: " + threeHourChance[7] + "%")
    $("#windDialog2").text("Gust Speed: " + threeHourGust[7] + " mph")
    $("#cloudDialog2").text("Cloud Coverage: " + threeHourClouds[7] + "%")
    $("#visDialog2").text("Visibility: " + threeHourVis[7] + " mi")
    $("#hour3").text(dayjs(ourLaunches[2].window_start).utc().utcOffset(-4).add(2, 'h').format("h a"))
    $("#chanceDialog3").text("Chance of rain: " + threeHourChance[8] + "%")
    $("#windDialog3").text("Gust Speed: " + threeHourGust[8] + " mph")
    $("#cloudDialog3").text("Cloud Coverage: " + threeHourClouds[8] + "%")
    $("#visDialog3").text("Visibility: " + threeHourVis[8] + " mi")
})

// show forecast data for specific launch window in modal
function showDialog() {
    let dialog = document.getElementById('dialog');
    dialog.classList.remove('hidden');
    setTimeout(() => {
        dialog.classList.remove('opacity-0');
    }, 20);
}
// hide the dialog box when go back is clicked
function hideDialog() {
    let dialog = document.getElementById('dialog');
    dialog.classList.add('opacity-0');
    setTimeout(() => {
        dialog.classList.add('hidden');
    }, 500);
}
$("#searchBtn").on("click", function (event) {
    event.preventDefault()
    var userInput = $("#userInput").val()
    $("#userInput").val("")
    userSearch(userInput);
})
//secondary modal-past launches
var modal2 = $("#modalTwo");
var pastBtn1 = $("#pastBtn1");
var pastBtn2 = $("#pastBtn2");
var pastBtn3 = $("#pastBtn3");

$("#closeModal2").on('click', function () {
    modal2.css("display", "none")
})

pastBtn1.on('click', function(){
    $("#pastDescription").text(ourPreviousLaunches[0].mission.description)
    openModal();
})
pastBtn2.on('click', function(){
    $("#pastDescription").text(ourPreviousLaunches[1].mission.description)
    openModal();
})
pastBtn3.on('click', function(){
    $("#pastDescription").text(ourPreviousLaunches[2].mission.description)
    openModal();
})

function openModal() {
    modal2.css("display", "block")
}

// init page by running functions can be changed to buttons later
getWeather();
getLaunches();
previousLaunches();