// Firebase Calls and definitions
const config = {
    apiKey: "AIzaSyCwQB5i43m4j4WfQ-XsyqggSLRZVLUtwSI",
    authDomain: "pickaflick-c5ed5.firebaseapp.com",
    databaseURL: "https://pickaflick-c5ed5.firebaseio.com",
    projectId: "pickaflick-c5ed5",
    storageBucket: "pickaflick-c5ed5.appspot.com",
    messagingSenderId: "440737258675"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// Global variables
var gc=false;
var zc=false;
var group='';
var pollID = '';
var ontimes = '';
var allResults = '';
var winner = '';
var timeWinner = '';
var groupsObjects=[];

// FUNCTIONS "hoisted" here

// Function Number 1
// The zipValid function checks and returns true for a valid zip and false otherwise
function zipValid(zc,zipcode){

    zipcode = zipcode.replace(/\D/,'');

    regexZip=new RegExp(/\d{5}/);

    if (zipcode === "") {

        alert("Enter a zip");
        return zc;
    
    } else if (regexZip.test(zipcode)!=true) {

        alert("A five digit zipcode is needed ");
        return zc ;

    } else {
        zc=true;
        return zc;
    };
};

// Function Number 2
// The writeLogin function writes a login made to an existing group (or one created recently) on Firebase
function writeLogin(group){

    logincredArray={"groupName":group,"groupStatus":"LoggedIn","groupLoginTime":moment().format('DD/MMM/YYYY HH:mm')};

    database.ref("ConnectionsNow").push(logincredArray);
};

// Function Number 3
// The groupCheck function checks if a group already exists or not, and handles the resulting notifications
function groupCheck(gc,group){

    if (groups.indexOf(group.trim()) > -1 ) {

        gc=true;
        $("#login-conf1").empty();
        $("#login-conf2").empty();
    
        $("#login-card").append($("<p>",{id:"login-conf1",text:"Group found"}));
        displayCurrentGroup(group);   
        $("#group-input").val("Logged In");
        
        return gc;
        ;
    } else {
        $("#login-conf1").empty();
        $("#login-conf2").empty();
        $("#login-card").append($("<p>",{id:"login-conf1",text:"Group does not exist"}))
                        .append($("<p>",{id:"login-conf2",text:"Try creating a new group"}));
        $("#add-group-input").val(group);
           
        return gc;
    } ;
};

// Function Number 4
// generateMovies function draws a table of all retrieved movie results based on the number of rows returned
function generateMovies(data) {

    // Remove existing movies
    $("#movie-table").empty();

    var moviesNeeded =[];
    for (var xx=0; xx < 5; xx++){
        // dont push if language is not english
        if( data[xx].descriptionLang === "en"){
            //assigns a default short description if one is not available
            if (!(data[xx].shortDescription)) {
                data[xx]["shortDescription"] = " Unavailable";
            };
            var Rating;
            if('ratings' in data[xx]){
                Rating = data[xx].ratings[0].code;
            }
            else{
                Rating = 'NA';
            }

            moviesNeeded.push({

                "title": data[xx].title,
                "runTime":moment.duration(data[xx].runTime).asMinutes(),
                "shortDescription":data[xx].shortDescription,                
                "Rating":Rating,

//                 "Title": data[xx].title,
//                 "Run Time":parseRunTime(data[xx].runTime),
//                 "Description":data[xx].shortDescription,                
//                 "Rating":data[xx].ratings[0].code,

                "Showtimes": data[xx].showtimes
                
            });

        };

    };

    //database.ref("GroupsList/"+group+"/movies/").set(moviesNeeded);

    // drawTable(moviesNeeded);

  };

// Function Number 5
//draws the table using the moviesNeeded array
function drawTable(ObjectArray){

    $("#movie-table").empty();

    $("#movie-table").append($("<th>",{text:'Title',id:"tableHeaderTitle"}))
                     .append($("<th>",{text:'Rating',id:"tableHeaderRating"}))
                     .append($("<th>",{text:'Description',id:"tableHeaderDescription"}))
                     .append($("<th>",{text:'Runtime',id:"tableHeaderRuntime"}));

    $("#movie-table").append($("<th>",{text:"Your Vote",id:"tableHeader"+"Vote"}));

    console.log(ObjectArray.length + "is the length of the movie array");

    for (var xx=0; xx < Math.min(5,ObjectArray.length) ; xx++){

        $("#movie-table").append($("<tr>",{id:"trow"+xx, class: 'movierow'}));
        $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+'Title', text: ObjectArray[xx].title}))
                     .append($("<td>",{id:"tableBody"+xx+'Rating', text: ObjectArray[xx].Rating}))
                     .append($("<td>",{id:"tableBody"+xx+'Description', text: ObjectArray[xx].shortDescription}))
                     .append($("<td>",{id:"tableBody"+xx+'Runtime', text: ObjectArray[xx].runTime}));

        // if (xx === 0){
            
        //     for ([key, value] of Object.entries(ObjectArray[xx])) {
        //         $("#movie-table").append($("<th>",{text:key,id:"tableHeader"+key.replace(/ +/g,"")}));
                               
        //         } ;  
        //     $("#movie-table").append($("<th>",{text:"Your Vote",id:"tableHeader"+"Vote"}));

        // };

        // $("#movie-table").append($("<tr>",{id:"trow"+xx}));

        // for ([key, value] of Object.entries(ObjectArray[xx])) {
            
        //     newkey=key.replace(/ +/g,"");
        //     $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+newkey}));
        //     $("#tableBody"+xx+newkey).append(value);
                    
        // };

        $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+"Vote"}));
        $("#tableBody"+xx+"Vote").append($("<input>",{class:"form-control",type:"number",id:"vote-form"+xx, choiceID: ObjectArray[xx].choiceID}));
        $("#movie-table").css({"text-align":"left"});

    };

};

// Function Number 6
//calls the movie API to assign movies to the group
function callMovieAPI(zipcode, group){

    var startDate = moment().format("YYYY-MM-DD");
    var api_key = 'seehjrjvumeesg8pe3e87j9j';
    var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
          'startDate=' + startDate +
          '&zip=' + zipcode +
          '&api_key=' + api_key;
  
    $.get(url).then(function(response) {

      var data = response;
      console.log(data);
      
      generateMovies(data);
      createPoll(data, group);
    });
  
  };

// Function Number 7 
//calls the voting API to assign choiceID values to the movies
function createPoll(data, group){

        var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/polls/with-choices?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO"

        var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json'
        };

        var pollObj = {"title": group, choices: [{label: data[0].title}, {label: data[1].title}, {label: data[2].title},
                                                 {label: data[3].title},{label: data[4].title}]}                                     

        $.ajax({
            url: url,
            type: 'POST',

            dataType: 'json',
            headers: headers,
            
            processData: false,
            data: JSON.stringify(pollObj),
            success: function (response) {
                console.log(JSON.stringify(response));
                var movies = database.ref("GroupsList/" + group + '/movies/');
                var groupref = database.ref("GroupsList/" + group);
                for (var xyz=0 ; xyz < 5 ; xyz ++){
                
                    if (!(data[xyz].shortDescription)) {
                        data[xyz]["shortDescription"] = " Unavailable";
                    };

                };
                pollID = response.id;

                groupref.update({pollID: response.id});

                
                var moviesObj = {};
                for(var i = 0; i<5; i++){
                    var Rating;
                    if('ratings' in data[i]){
                        Rating = data[i].ratings[0].code;
                    }
                    else{
                        Rating = 'NA';
                    }

                    var runTime;
                    if('runTime' in data[i]){
                        runTime = moment.duration(data[i].runTime).asMinutes();
                    }
                    else{
                        runTime = 'NA';
                    }

                    moviesObj['movie' + i]= new Movie(data[i].title, runTime, data[i].shortDescription, Rating, response.choices[i].id, data[i].showtimes);
                }

                movies.set(moviesObj);

                // $("#vote-form0").attr("choiceID", response.choices[0].id);
                // $("#vote-form1").attr("choiceID", response.choices[1].id);
                // $("#vote-form2").attr("choiceID", response.choices[2].id);
                // $("#vote-form3").attr("choiceID", response.choices[3].id);
                // $("#vote-form4").attr("choiceID", response.choices[4].id);

                var movieArray = Object.keys(moviesObj).map(function(key) {
                    return moviesObj[key];
                });
             
                drawTable(movieArray);
            },
            error: function(){
            alert("Cannot get data");
            }
        });
  }

  class Movie {
      constructor(title, runTime, shortDescription, Rating, choiceID, showtimes){
          this.title = title;
          this.runTime = parseRunTime(runTime);
          this.shortDescription = shortDescription;
          this.Rating = Rating;
          this.choiceID = choiceID;
          this.showtimes = showtimes;
      }
  }
  
// Function Number 8
// gets movies from firebase when a group logs in
function getMoviesforGroup(group){

    var groupreference =  database.ref("GroupsList/" + group + "/movies/");
    groupreference.on("value", function(snapshot){
    
    var movieArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
    });

    console.log(movieArray);
 
    drawTable(movieArray);

    });

};

function getTimesforGroup(group){

    var groupreference =  database.ref("GroupsList/" + group + "/times/");
    groupreference.on("value", function(snapshot){
    
    var timesArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });
 
    drawTimesTable(timesArray);

    });

};

// EVENT HANDLERS

// EH Number 1
// Whenever the groups in Firebase Changes - this updates a local copy so that people (and the JS program) know which groups are there
database.ref("GroupsList").on("value", function(snapshot) {
    console.log(snapshot.val());
    groups = []; 
    
    for (key of Object.entries(snapshot.val())){
        groups.push(key[1].groupName);
        var kn=key[1].groupName;
        kz=key[1].movies;
        var groupObjects1 ={};
        groupObjects1 = {"group":kn,"movies":kz};
        groupsObjects.push(groupObjects1);

    };
  
});

// EH Number 2
// Clicking the Submit button leads to a new group being added - this includes a test for the zipcode being correct
$('#submit-btn').on("click",function(event){

    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();
    $("#already-there-note").remove();

    group = $("#add-group-input").val();
    group = group.replace(/\s/g, '_').toLowerCase();
    
    // Capture zipcode
    var zipcode = $("#zipcode-input").val();

    if (zc === false) {
                // Check the zipcode
                zc=zipValid(zc,zipcode);
                
    };

    if (zc=== true){
        
        if( groups.indexOf(group) === -1) {
            groupArray={"groupName":group,"zipcode":zipcode, ontimes: 'no', allResults: 'no',
                        winner: '', timeWinner: ''};
            ontimes = 'no';
            allResults = 'no';

            var ref = database.ref("GroupsList/" + group);
            ref.set(groupArray);
            writeLogin(group);
            $("#group-card").append($("<p>",{id:"already-there-note",text:"New group added"}));
            $("#group-input").val(group);
            $("#submit-button").text("Add another Group ");
            displayCurrentGroup(group);
            //calling the Movie API
            callMovieAPI(zipcode, group);

        } else {

            $("#group-card").append($("<p>",{id:"already-there-note",text:"This group already exists - Please login"}));
            $("#submit-button").text("Add another Group ");
        };

    };


});

// EH Number 3
// This handles the login attempt and checks if the group exists . If yes , it logs you in 
$("#login-btn").on("click",function(event){

    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();

    $("#login-conf1").remove();
    $("#login-conf2").remove();
    
    // GRoup should be captured
    group = $("#group-input").val().trim();
    $("#group-input").val("");
    group = group.replace(/\s/g, '_').toLowerCase();

    //Check if Group already exists
    recCheck(gc);
    function recCheck(gc){
    if (gc === false) { 
        gc=groupCheck(gc,group);

        var ref = database.ref("GroupsList/" + group );

        ref.on("value", function(snapshot){
            pollID = snapshot.val().pollID;
            ontimes = snapshot.val().ontimes;
            allResults = snapshot.val().allResults;
            winner = snapshot.val().winner;
            timeWinner = snapshot.val().timeWinner;
        });

        if(ontimes === 'no'){
            getMoviesforGroup(group);
        }
        else if(allResults === 'no'){
            $("#results").append($('<p>').text("You chose " + winner));
            getTimesforGroup(group);
        }
        else{
            $("#results").append($('<p>').text("You chose " + winner));
            $("#results").append($('<p>').text("At " + timeWinner));
        }


       };

       if (gc===true) {
        writeLogin(group);
        
       };
    };

});

// EH Number 4
// Voting Button event handler runs through all votes and stores them in an Array. 
// These votes will also be saved to firebase
$("#vote-btn").on("click", function(){

    var VotesArray=[];

    $("#not-vote-msg").remove();

    console.log($('.movierow').length);

    for (var i = 0 ; i < 5 ; i ++) {
        var Votes = {};
        Votes["choice_id"] = $("#vote-form"+i).attr("choiceID");
        Votes["rank"] = parseInt($("#vote-form"+i).val());
        VotesArray.push(Votes);
     
    };

    console.log("Votes Array: " + JSON.stringify(VotesArray));

    //validation function
    if(testVote(VotesArray)){

        var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/votes/for-poll/" + pollID + "?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO";
    
        var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json'
        };

        console.log("Votes Array: " + JSON.stringify(VotesArray));

        $.ajax({
            url: url,
            type: 'POST',
    
            dataType: 'json',
            headers: headers,
    
            processData: false,
            data: JSON.stringify(VotesArray),
            success: function (data) {
                console.log(JSON.stringify(data));
            },
            error: function(){
            alert("Cannot get data");
            }
        });
    }


    function testVote(vote){
        var testArray = [];
        for(var i = 0; i<vote.length; i++){
            rank = parseInt(vote[i].rank);
            if(rank <= vote.length && rank>0){
                testArray[rank-1] = parseInt(rank);
            }

        }
        for(var i = 0; i<vote.length; i++){
            if(testArray[i] != i+1){
                return false;
            }
        }
        return true;
     };


    vc = testVote(VotesArray);

    if (vc === false) {

        $("vote-card").append($("<p>",{id:"not-vote-msg",text:"Voting not in order - please check"}));


    };


});

$("#vote-btn2").on("click", function(){

    var VotesArray=[];

    $("#not-vote-msg").remove();

    console.log($('.timerow').length);

    for (var i = 0 ; i < $('.timerow').length ; i ++) {
        var Votes = {};
        Votes["choice_id"] = $("#vote-form-time"+i).attr("choiceID");
        Votes["rank"] = parseInt($("#vote-form-time"+i).val());
        VotesArray.push(Votes);
     
    };

    console.log("Votes Array: " + JSON.stringify(VotesArray));

    //validation function
    if(testVote(VotesArray)){

        var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/votes/for-poll/" + pollID + "?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO";
    
        var headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json'
        };

        console.log("Votes Array: " + JSON.stringify(VotesArray));

        $.ajax({
            url: url,
            type: 'POST',
    
            dataType: 'json',
            headers: headers,
    
            processData: false,
            data: JSON.stringify(VotesArray),
            success: function (data) {
                console.log(JSON.stringify(data));
            },
            error: function(){
            alert("Cannot get data");
            }
        });
    }


    function testVote(vote){
        var testArray = [];
        for(var i = 0; i<vote.length; i++){
            rank = parseInt(vote[i].rank);
            if(rank <= vote.length && rank>0){
                testArray[rank-1] = parseInt(rank);
            }

        }
        for(var i = 0; i<vote.length; i++){
            if(testArray[i] != i+1){
                return false;
            }
        }
        return true;
     };


    vc = testVote(VotesArray);

    if (vc === false) {

        $("vote-card").append($("<p>",{id:"not-vote-msg",text:"Voting not in order - please check"}));


    };
});

// EH Number 5
//when submit all votes is clicked 
$("#results-btn").on("click", function(){

    console.log(pollID);

    var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/polls/" + pollID + "/results/condorcet?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO";

    var headers = {
             'Accept': 'application/json',
             'Content-type': 'application/json'
     };

    $.ajax({
        url: url,
        type: 'GET',

        
        headers: headers,
        
        success: function (data) {
          console.log(JSON.stringify(data));
          $("#results").append($('<p>').text("You chose " + data[0].choice.label));

          var groupref = database.ref("GroupsList/" + group);
          groupref.update({winner: data[0].choice.label});

          var moviereference =  database.ref("GroupsList/" + group + "/movies/");
            moviereference.on("value", function(snapshot){
            
            var movieArray = Object.keys(snapshot.val()).map(function(key) {
                return snapshot.val()[key];
            });

            for(var i = 0; i<5; i++){
                if(movieArray[i].choiceID === data[0].choice.id){
                    
                    var timesArray = Object.keys(movieArray[i].showtimes).map(function(key) {
                        return movieArray[i].showtimes[key];
                    });

                    createTimesPoll(timesArray);
                    
                }
            }
        });


        },
        error: function(){
          alert("Cannot get data");
        }
    });
   
});

$("#results-btn2").on("click", function(){

    console.log(pollID);

    var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/polls/" + pollID + "/results/condorcet?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO";

    var headers = {
             'Accept': 'application/json',
             'Content-type': 'application/json'
     };

    $.ajax({
        url: url,
        type: 'GET',

        
        headers: headers,
        
        success: function (data) {
            console.log(JSON.stringify(data));
            $("#results").append($("<p>").text("At " + data[0].choice.label));

            var groupref = database.ref("GroupsList/" + group);
            groupref.update({timeWinner: data[0].choice.label});
            groupref.update({allResults: 'yes'});
        },
        error: function(){
          alert("Cannot get data");
        }
    });
   
});


function drawTimesTable(timesArray){
    
    for (var xx=0; xx < Math.min(3,timesArray.length) ; xx++){
        

        $("#showtimes-table").append($("<tr>",{id:"trowtimes"+xx, class: "timerow"}));
        $("#trowtimes"+xx).append($("<td>",{id:"timesBody"+xx+'Title', text: timesArray[xx].theatre}))
                    .append($("<td>",{id:"timesBody"+xx+'Rating', text: timesArray[xx].dateTime}));
        

        $("#trowtimes"+xx).append($("<td>",{id:"timesBody"+xx+"Vote"}));
        $("#timesBody"+xx+"Vote").append($("<input>",{class:"form-control",type:"number",id:"vote-form-time"+xx, choiceID: timesArray[xx].choiceID}));
        $("#showtimes-table").css({"text-align":"left"});
            
    }
}

function createTimesPoll(data){

    var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/polls/with-choices?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO"

    var headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json'
    };

    var choices = [];

    for(var i = 0; i < data.length; i++){
        choices.push({label: data[i].theatre.name + ' at ' + data[0].dateTime});
    }

    var pollObj = {"title": group, choices: choices};                                 

    $.ajax({
        url: url,
        type: 'POST',

        dataType: 'json',
        headers: headers,
        
        processData: false,
        data: JSON.stringify(pollObj),
        success: function (response) {
            console.log(JSON.stringify(response));
            var times = database.ref("GroupsList/" + group + '/times/');
            var groupref = database.ref("GroupsList/" + group);
            
            pollID = response.id;
            groupref.update({pollID: response.id});
            groupref.update({ontimes: 'yes'});
            ontimes = 'yes';

            var timesObj = {};

            for(var i = 0; i < data.length; i++){
                timesObj['time' + i] = new Time(theatre = data[i].theatre.name, dateTime = data[i].dateTime, choiceID = response.choices[i].id);
            }

            times.set(timesObj);

            var timesArray = Object.keys(timesObj).map(function(key) {
                return timesObj[key];
            });
         
            drawTimesTable(timesArray);
        },
        error: function(){
        alert("Cannot get data");
        }
    });
}

class Time {
  constructor(theatre, dateTime, choiceID){
      this.theatre = theatre;
      this.dateTime = dateTime;
      this.choiceID = choiceID;
      
  }
}

// TEST EH Number 6 
// Pull snapshot of movies 
// var movies = database.ref("GroupsList/" + "coders" + '/movies');

// movies.on("value", function(snapshot) {

// console.log(snapshot.val());

// });

function displayCurrentGroup(group) {
    var groupArr = group.split('_')
    var formattedStr = ''
    for(let word of groupArr) {
        formattedStr += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    }
    setTimeout(function() {
        $('#login-card').empty()
        $("#login-card").append("You are now logged in to group:" + "<h2 class='group-name'>" + formattedStr + "</h2>")
        $('.group-name').css('margin', '15px');
    }, 2000); 
}

//turn runTime format(ISO) to something readable
function parseRunTime(runTime) {
  var hours = parseInt(runTime.slice(3, runTime.length - 4));
  var minutes = parseInt(runTime.slice(5, runTime.length - 1));
  var formatedRunTime = (hours * 60) + minutes;
  return formatedRunTime;
}
