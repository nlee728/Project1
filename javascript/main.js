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
var group='Default';
var pollID = '';
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
        var groupArr = group.split('_')
        var formattedStr = ''
        for(let word of groupArr) {
            formattedStr += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
        }
        $("#login-card").append($("<p>",{id:"login-conf1",text:"Group found"}));
        setTimeout(function() {
            $('#login-card').empty()
            $("#login-card").append("You are now logged in to group:" + "<h2 class='group-name'>" + formattedStr + "</h2>")
            $('.group-name').css('margin', '15px');
        }, 2000);    
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

            moviesNeeded.push({
                "Title": data[xx].title,
                "Run Time":moment.duration(data[xx].runTime).asMinutes(),
                "Description":data[xx].shortDescription,                
                "Rating":data[xx].ratings[0].code,
                "Showtimes": data[xx].showtimes
                
            });

        };

    };

    database.ref("GroupsList/"+group+"/movies/").set(moviesNeeded);

    drawTable(moviesNeeded);

  };

// Function Number 5
//draws the table using the moviesNeeded array
function drawTable(ObjectArray){

    $("#movie-table").empty();

    console.log(ObjectArray.length + "is the length of the movie array");

    for (var xx=0; xx < Math.min(5,ObjectArray.length-1) ; xx++){

        if (xx === 0){
            
            for ([key, value] of Object.entries(ObjectArray[xx])) {
                $("#movie-table").append($("<th>",{text:key,id:"tableHeader"+key.replace(/ +/g,"")}));
                               
                } ;  
            $("#movie-table").append($("<th>",{text:"Your Vote",id:"tableHeader"+"Vote"}));

        };

        $("#movie-table").append($("<tr>",{id:"trow"+xx}));

        for ([key, value] of Object.entries(ObjectArray[xx])) {
            
            newkey=key.replace(/ +/g,"");
            $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+newkey}));
            $("#tableBody"+xx+newkey).append(value);
                    
        };

        $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+"Vote"}));
        $("#tableBody"+xx+"Vote").append($("<input>",{class:"form-control",type:"number",id:"vote-form"+xx}));
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

                var moviesObj = {pollID: response.id,
                                movie0: new Movie(data[0].title, data[0].runTime, data[0].shortDescription, data[0].ratings[0].code, response.choices[0].id, data[0].showtimes),
                                movie1: new Movie(data[1].title, data[1].runTime, data[1].shortDescription, data[1].ratings[0].code, response.choices[1].id, data[1].showtimes),
                                movie2: new Movie(data[2].title, data[2].runTime, data[2].shortDescription, data[2].ratings[0].code, response.choices[2].id, data[2].showtimes),
                                movie3: new Movie(data[3].title, data[3].runTime, data[3].shortDescription, data[3].ratings[0].code, response.choices[3].id, data[3].showtimes),
                                movie4: new Movie(data[4].title, data[4].runTime, data[4].shortDescription, data[4].ratings[0].code, response.choices[4].id, data[4].showtimes)
                                }

                movies.set(moviesObj);

                $("#vote-form0").attr("choiceID", response.choices[0].id);
                $("#vote-form1").attr("choiceID", response.choices[1].id);
                $("#vote-form2").attr("choiceID", response.choices[2].id);
                $("#vote-form3").attr("choiceID", response.choices[3].id);
                $("#vote-form4").attr("choiceID", response.choices[4].id);
            },
            error: function(){
            alert("Cannot get data");
            }
        });
  }

  class Movie {
      constructor(title, runTime, shortDescription, Rating, choiceID){
          this.title = title;
          this.runTime = runTime;
          this.shortDescription = shortDescription;
          this.Rating = Rating;
          this.choiceID = choiceID;
      }
  }
  
// Function Number 8
// gets movies from firebase when a group logs in
function getMoviesforGroup(group){

    var groupreference =  database.ref("GroupsList/" + group + "/movies/");
    groupreference.on("value", function(snapshot){
    
    pollID = snapshot.val().pollID;
    var movieArray = Object.keys(snapshot.val()).map(function(key) {
        return snapshot.val()[key];
      });
 
    drawTable(movieArray);

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

    var group = $("#add-group-input").val();
    group = group.replace(/\s/g, '_').toLowerCase();
    
    // Capture zipcode
    var zipcode = $("#zipcode-input").val();

    if (zc === false) {
                // Check the zipcode
                zc=zipValid(zc,zipcode);
                
    };

    if (zc=== true){
        
        if( groups.indexOf(group) === -1) {
            groupArray={"groupName":group,"zipcode":zipcode};

            var ref = database.ref("GroupsList/" + group);
            ref.set(groupArray);
            writeLogin(group);
            $("#group-card").append($("<p>",{id:"already-there-note",text:"New group added"}));
            $("#group-input").val(group);
            $("#submit-button").text("Add another Group ");

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
    
    // Group should be captured
    var group = $("#group-input").val().trim();
    $("#group-input").val("");
    group = group.replace(/\s/g, '_').toLowerCase();

    //Check if Group already exists
    recCheck(gc);
    function recCheck(gc){
    if (gc === false) { 
        gc=groupCheck(gc,group);

        getMoviesforGroup(group);

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

    console.log($('.trr').length);

    for (var i = 0 ; i < 5 ; i ++) {
        var Votes = {};
        Votes["choice_id"] = $("#tableBody" + i + "choiceID").text();
        console.log($("#tableBody" + i + "choiceID").text());
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

// EH Number 5
//when submit all votes is clicked 
$("#results-btn").on("click", function(){

    console.log(pollID);

    var url = "https://cors-anywhere.herokuapp.com/https://api.open-agora.com/polls/" + pollID + "/results/condorcet?api_token=ftYSoK8x1D5R9n0XMn5TAEdAzxeiaLZO"

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
          $("#graph-card").text("The Winner is " + data[0].choice.label);
        },
        error: function(){
          alert("Cannot get data");
        }
    });
   
});

// TEST EH Number 6 
// Pull snapshot of movies 
// var movies = database.ref("GroupsList/" + "coders" + '/movies');

// movies.on("value", function(snapshot) {

// console.log(snapshot.val());

// });