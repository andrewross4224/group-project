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


// when the user clicks on launches nav link it will open a modal 
// launches.addEventListener.click(function() {
//     console.log(123)
//     var launchModal = $('#launchModal')
//         launchModal.style.display = "block";  
// })


launches.addEventListener("click", getLaunches);