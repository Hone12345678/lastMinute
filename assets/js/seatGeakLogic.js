// var myClientID ="MjQ3NDgwNzd8MTYzODUwMTM2OS43OTkxNDE0";
// var mySID = "2b0b7028d8aead384e4849058a883ca9d344d06dc999989bcbee64d5e87255e3";


// luc client id = MjQ3NDc1MzZ8MTYzODQ5OTY1Ny41MTE4OTg1
// luc mySID = 2b0b7028d8aead384e4849058a883ca9d344d06dc999989bcbee64d5e87255e3

var dialog = document.getElementById("dialogModal")
var modalText = dialog.firstChild.nextSibling.firstChild.nextSibling
var eventPosting = $(".eventPostersContainer");
console.log(modalText);

var saveObj = {
    saveTitle: [],
    saveImage: [],
    saveDate: [],
    saveLocation: [],
    saveUrl: []
};

var currentdate = new Date();
var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + (currentdate.getDate()+1)

console.log(datetime)

var getUserEvents = function () {

    var userZip = $("#userZip").val();
    var userRange = $("#userRange").val();
    var gatherUserInput = `https://api.seatgeek.com/2/events?client_id=MjQ3NDc1MzZ8MTYzODQ5OTY1Ny41MTE4OTg1&geoip=${userZip}&range=${userRange}`;
    fetch(gatherUserInput).then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json().then(function(data){
                    renderItem(data);
                    console.log(data);
                });
            } else {

                modalText.textContent = "Looks like your zip code was not accepted or a desired search radius was not selected. Make sure that information is updated and we'll be able to suggest some events in your area!";
                solveTheProblem();
                return;
            }
        })
        .then(function (data) {
            console.log(data);
        });   
};

function renderItem(data) {
    for (let i = 0; i < data.events.length; i++) {

        var linkEl = $("<a></a>");
        linkEl.attr("href", data.events[i].url)
        .attr("target", "_blank")
        .attr("class", "col-sm-12 col-md-4 py-2");

        var imageEl = $("<img>");
        imageEl.attr("src", data.events[i].performers[0].image);
        imageEl.attr("class", "col")
        imageEl.appendTo(linkEl);
        console.log(imageEl);

        var eventContainerEl = $("<div></div>");
        eventContainerEl.addClass("border border-dark col-sm-12 mb-3 bckgrnd");

        var eventRowEl = $("<div></div>");
        eventRowEl.attr("class", "row mb-2");
        
        var eventRowEl2 = $("<div></div>");
        eventRowEl2.attr("class", "row");

        var eventInfo = $("<div></div>");
        eventInfo.attr("class", "col-sm-12 col-md-8 py-2");

        var eventTitle = $("<h3></h3>");
        eventTitle.text(data.events[i].title);
        eventTitle.appendTo(eventInfo);
        
        var eventType = $("<p> </p>");
        eventType.text(data.events[i].type);
        eventType.appendTo(eventInfo);

        var eventDateTime = $("<p> </p>");
        eventDateTime.text(data.events[i].datetime_local);
        eventDateTime.appendTo(eventInfo);

        var eventDateLocation= $("<p></p>");
        eventDateLocation.text(data.events[i].venue.name);
        eventDateLocation.appendTo(eventInfo);

        var saveButton =$("<button>Yes Please!</button>").attr("class","btn-secondary btn-sm")
        saveButton.on("click", saveTheEvent);
        saveButton.appendTo(eventInfo);
    
        linkEl.prependTo(eventRowEl2);
        eventInfo.appendTo(eventRowEl2);
        eventRowEl2.appendTo(eventContainerEl);
        eventContainerEl.appendTo(eventRowEl);
        eventRowEl.appendTo(eventPosting);
    }
}


var eventsInArea = document.querySelector(".eventsInArea");
$(".eventInput").submit(function (event) {
    event.preventDefault();
    eventPosting.html("");
    getUserEvents();
})



var cancelButton = document.getElementById('cancel')
function solveTheProblem() {
    dialog.showModal();
    cancelButton.addEventListener('click', function() {
        dialog.close();
    });
};



var saveTheEvent = function(event) {
    event.target;
    // THIS DOES NOT TARGET THE EVENT SELECT TO IT RETURNS A NULL VALUE
    var saveDetails = this.closest("div");
    saveObj.saveUrl.splice(0, 1, saveDetails.previousSibling.href);
    saveObj.saveImage.splice(0, 1, saveDetails.previousSibling.firstChild.src);
    saveObj.saveTitle.splice(0, 1, saveDetails.firstChild.innerText);
    saveObj.saveDate.splice(0, 1, saveDetails.firstChild.nextSibling.nextSibling.innerText);
    saveObj.saveLocation.splice(0, 1, saveDetails.firstChild.nextSibling.nextSibling.nextSibling.innerText);
console.log(saveObj);
    localStorage.setItem("savedEvent", JSON.stringify(saveObj));
}
