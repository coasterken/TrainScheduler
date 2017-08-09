
$(document).ready(function() {

// Javascript and jquery for Train Scheduler
/* Pseudocode
// layout with jumbotron and panels 
// Investigate masking of time entry
// Use moment.js for time calculations
// Use table for train data display?????
// Use Firebase to store data - you need to push it
// Train data - Name, Dest, First Train, Frequency
      Validate first train using moment.js(" ", "HH:mm", true)isValid()
      invalid --> display message and use BS to turn box red
      Similar thing for Frequency
// Display
//    Train Name - from Name
//      Destination - from Dest
//      Frequency - from Frequency
//      Next Arrival - current time + minutes away
        Minutes Away - frequency-(current time - first train)  

*/

// Database
  var config = {
    apiKey: "AIzaSyCJ84HoVNPL4pABCYANaxO2yYRsIyfnCq8",
    authDomain: "train-scheduler-5a8fa.firebaseapp.com",
    databaseURL: "https://train-scheduler-5a8fa.firebaseio.com",
    projectId: "train-scheduler-5a8fa",
    storageBucket: "train-scheduler-5a8fa.appspot.com",
    messagingSenderId: "276513744751"
  };

  firebase.initializeApp(config);

  $(".errorMsg").hide();

// Variables

var database = firebase.database();

//**********  Functions  **********
//**********  Functions  **********
//**********  Functions  **********

//**********  Methods  **********
//**********  Methods  **********
//**********  Methods  **********
// var postedTimeplay = "15:00";
// var convplay = moment(postedTimeplay, "HH:mm").subtract(1, "years");
// console.log("converted " + convplay)
// var diffminplay =  moment().diff(moment(convplay), "minutes");
// console.log(diffminplay);

//Add a train schedule
$("#addTrain").on("click", function() {

  event.preventDefault();
  
  var trainName = $("#trainName").val().trim();
  var trainDest = $("#trainDest").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var trainFreq = $("#trainFreq").val().trim();

  //Validate first train is military time
  if (moment(firstTrain, "HH:mm", true).isValid() ||
      moment(firstTrain, "H:mm", true).isValid() ) {

    $(".errorMsg").hide();
    $(".gFirstTrain").removeClass("has-error");

  } else {

    $(".errorMsg").show();
    $(".gFirstTrain").addClass("has-error");    
    return;
  }

   //Validate frequency is seconds
  if ($.isNumeric(trainFreq) &&
      parseInt(trainFreq) > 0 ) {

    $(".errorMsg").hide();
    $(".gFreq").removeClass("has-error");

  } else {

    $(".errorMsg").show();
    $(".gFreq").addClass("has-error");    
    return;
  }

    // Save the new price in Firebase
  database.ref().push({
    trainName: trainName,
    trainDest: trainDest,
    firstTrain: firstTrain,
    trainFreq: trainFreq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

})  //end of add train

// database.ref().on("child_added", function(childsnapshot) {




// })

database.ref().orderByChild("trainDest").on("child_added", function(childsnapshot) {

  //store posted time - use this just in case
  var postedTime = moment();
  var convertedPostDate = moment(postedTime, "HH:mm");

  $(".postedTime").html("Current Time (24/12): " + 
                         moment(convertedPostDate).format("HH:mm") + 
                         " / " +
                         moment(convertedPostDate).format("hh:mm A")
                         );

  var dbFirstTrain = moment(childsnapshot.val().firstTrain, "HH:mm");

  var dbFreq = parseInt(childsnapshot.val().trainFreq);

  var minutesAway = 0;
  var diffmin = 0;
  if (moment().isBefore(dbFirstTrain)) {

    minutesAway = moment(dbFirstTrain).diff(convertedPostDate, "minutes", true);
  } else {

    diffmin =  moment(convertedPostDate).diff(dbFirstTrain, "minutes", true);
    minutesAway = dbFreq - (diffmin % dbFreq);
  }

  // console.log("train " + childsnapshot.val().trainName +
  //             " converted post " + moment(convertedPostDate).format("HH:mm") +
  //             " firsttrain " + moment(dbFirstTrain).format("HH:mm") +
  //             " diffmin " + diffmin + 
  //             " mins away " + minutesAway)
  
  var nextArrival = moment(convertedPostDate).add(Math.ceil(minutesAway), "minutes");

  var tbl = $("<tr>");
  // Name
  var tname = $("<td>");
  tname.html(childsnapshot.val().trainName);
  tbl.append(tname);
  // Destination
  var tdest = $("<td>");
  tdest.html(childsnapshot.val().trainDest);
  tbl.append(tdest);
 // Frequency
  var tfreq = $("<td>");
  tfreq.html(childsnapshot.val().trainFreq);
  tbl.append(tfreq);

//next arrival
  var tnext = $("<td>");
  tnext.html(moment(nextArrival).format("hh:mm A"));
  tbl.append(tnext);

 //minutes away
  var tmin = $("<td>");
  tmin.html(Math.ceil(minutesAway));
  tbl.append(tmin);

  $(".trainData").append(tbl);

  $("#trainName").val("");
  $("#trainDest").val("");
  $("#firstTrain").val("");
  $("#trainFreq").val("");

  
})

})  // end of doc ready