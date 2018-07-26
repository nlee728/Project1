// Firebase Calls and definitions - taken from John's code

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



// Temp list of groups here - in future - these will come from firebase
var gc=false;
var zc=false;
// I really dont think this is neeeded , but playing it safe for now
var group='Default';


// Functions "hoisted" here

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
    console.log(group);
    console.log(groups);

    if (groups.indexOf(group.trim()) > -1) {

        gc=true;
        $("#login-conf1").empty();
        $("#login-conf2").empty();
        
        $("#login-card").append($("<p>",{id:"login-conf1",text:"Group found."}));
        $("#login-card").append($("<p>",{id:"login-conf2",text:"You are now logged in!"}));
        $("#group-input").val("Logged In");
        $("#login-btn").text("Logged In");
        $("#login-btn").css({"background-color":"green"});
        return gc;
        ;
    } else {
        $("#login-conf1").empty();
        $("#login-conf2").empty();
        $("#login-card").append($("<p>",{id:"login-conf1",text:"Group does not exist "}))
                        .append($("<p>",{id:"login-conf2",text:"Click Add to create the same."}));
        $("#add-group-input").val(group);
        $("#login-btn").text("--->");
        $("#group-input").val("Not Found");

                        // .append($("<button>",{text:"Ok",class:"btn-primary",id:"ok-group"}));     
        return gc;
    } ;
};

// Function Number 4 - from John

// Function to draw a table based on results from the callMovie API

// SS - STILL WIP

// generateMovies function draws a table of all retrieved movie results based on teh number of rows returned

function generateMovies(data) {

    // Remove existing movies

    $("#movie-table").empty();

    // SS - change - created a short subset instead of teh entire object
    var moviesNeeded =[];
    for (var xx=0; xx < 5; xx++){
         moviesNeeded.push({
            "Title": data[xx].title,
            "Genre": data[xx].genres,
            "Run Time":data[xx].runTime,
            "Rating":data[xx].ratings,
            "Description":data[xx].shortDescription

        });
    };

    console.log(moviesNeeded);

    drawTable(moviesNeeded);


    // for(let movie of moviesNeeded) {
    //     var tr =  $('<tr>',{id:"tablerow"+data.indexOf(movie)});

    //     // IF first row , add the headings
    //     if(data.indexOf(movie)===0) {
    //         var th = $('<th>');
    //         tr.append(th).text(movie.Title);
    //         tr.append(th).text(movie.Genre.join(", "));
    //         tr.append(th).text(movie["Run Time"]);
    //         tr.append(th).text(movie["Rating"][0].code);           
    //         tr.append(th).text(movie["Description"]);  
    //     };


    //     var th = $('<th>');


    //     $('#movie-table').append(tr);
    //     tr.append(th).text(movie.Title);
    //     tr.append(th).text(movie.Genre);
    //     tr.append(th).text(movie["Run Time"]);
    //     tr.append(th).text(movie["Rating"]);           
    //     tr.append(th).text(movie["Description"]);  
    
  };


// Function Number 6 - drawTable

function drawTable(ObjectArray){

    $("#movie-table").empty();

    for (var xx=0; xx < ObjectArray.length ; xx++){

        if (xx === 0){
            
            for ([key, value] of Object.entries(ObjectArray[xx])) {
                $("#movie-table").append($("<th>",{text:key,id:"tableHeader"+key.replace(/ +/g,"")}));
                               
                } ;  

        };

        $("#movie-table").append($("<tr>",{id:"trow"+xx}));

        for ([key, value] of Object.entries(ObjectArray[xx])) {
            
            newkey=key.replace(/ +/g,"");
            $("#trow"+xx).append($("<td>",{id:"tableBody"+xx+newkey}));
            $("#tableBody"+xx+newkey).append(value);
                    
        };


    };



};


// Function number 4
function callMovieAPI(zipcode){

    var startDate = moment().format("YYYY-MM-DD");
    var api_key = 'seehjrjvumeesg8pe3e87j9j';
    var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
          'startDate=' + startDate +
          '&zip=' + zipcode +
          '&api_key=' + api_key;
  
     
    $.get(url).then(function(response) {
      console.log(response);
      var data = response;
      
      generateMovies(data);
    });
  
  };
  

// EVENT HANDLERS

// EH Number 1
// Whenever the groups in Firebase Changes - this updates a local copy so that people (and the JS program) know which groups are there

// Note to John / team - please let me know if this firebase table name needs to change

database.ref("GroupsList").on("value", function(snapshot) {
    console.log(snapshot.val());
    groups = []; 

    for (key of Object.entries(snapshot.val())){
        groups.push(key[1].groupName);
    };

});

// EH Number 2
// Clicking the Submit button leads to a new group being added - this includes a test for the zipcode being correct
$('#submit-btn').on("click",function(event){

    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();
    $("#already-there-note").remove();

    var group = $("#add-group-input").val();
    console.log(group);

// Capture zipcode
    var zipcode = $("#zipcode-input").val();

    if (zc === false) {
                // Check the zipcode
                zc=zipValid(zc,zipcode);
                console.log(zc);
    };

    // SS - Right now - I consider one group to be fixed to just one zipcode - however - we can add an array of zipcodes to the list later on)

    if (zc=== true){
        
        if( groups.indexOf(group) === -1) {
            groupArray={"groupName":group,"zipcode":zipcode};

            // Thing to do : get movies for this zipcode - clearInterval
            // add that to th egroup array
            // comment placeholder for callMovieAPI


            var ref = database.ref("GroupsList/" + group);
            ref.set(groupArray);
            writeLogin(group);
            $("#group-card").append($("<p>",{id:"already-there-note",text:"Group added - login <---"}));
            $("#group-input").val(group);
            $("#submit-button").text("Add another Group ");

            // MAke the call to John's function - calling the Movie API

            callMovieAPI(zipcode);



        } else {
            console.log("already there");
            $("#group-card").append($("<p>",{id:"already-there-note",text:"Group already exists - no need to add"}));
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
    var group = $("#group-input").val();
    $("#group-input").val("");
    //Check if Group already exists
    
    console.log("checking first time");
    recCheck(gc);
    function recCheck(gc){
    if (gc === false) { 
        gc=groupCheck(gc,group);
        console.log(gc);
       };

       
        // Note for John : - 
        // Variable - gc = true will be a sign of a login ;
        // Variable - group - indicates the group logged in ;
        // group can be used as a parameter to retrieve details from firebase for that specific group      

        // Temporary Code
        // This will write the current user as a log in to the firebase groups app

       if (gc===true) {
        writeLogin(group);
       };
    };




});

// EH Number 4

// Voting Button event handler runs through all votes and stores them in an Array. 
// These votes will also be saved to firebase

$("#vote-btn").on("click", function(){

    var Votes={Movie:"",Rank:""};
    var VotesArray=[];

    $("#not-vote-msg").remove();



    // Notes : (for Nutishia's ref:):
    // - Currently - movie names etc are placeholders, but these will be replaced with dynamic javascript to create the table (keeping the table header)
    // - the table elements (tr and the td) for movies and rank form-input will have a separate id - this will change based on the number of results the movies api returns


    for (var i = 0 ; i < $('.trr').length ; i ++) {
        Votes["Movie"] = $("#trmov"+i).text();
        Votes["Rank"] = $("#trrmov"+i).val();
        VotesArray.push({"Movie":Votes["Movie"],"Rank":Votes["Rank"]});
     



    };

    // for checking 
    console.log("The resulting array");
    console.log(VotesArray);

    // Charlie's validation function


    function testVote(vote){
        var testArray = [];
        for(var i = 0; i<vote.length; i++){
            rank = parseInt(vote[i].Rank);
            console.log(rank);
            if(rank <= vote.length && rank>0){
                testArray[rank-1] = parseInt(rank);
            }
            console.log(testArray);
        }
        for(var i = 0; i<vote.length; i++){
            if(testArray[i] != i+1){
                return false;
            }
        }
        return true;
     };


    vc = testVote(VotesArray);
    console.log(vc);

    if (vc === false) {

        $("vote-card").append($("<p>",{id:"not-vote-msg",text:"Voting not in order - please check"}));


    };


});


// EH Number 5

// Placeholder EH - when submit all votes is clicked 

$("#results-btn").on("click", function(){
   
    // Placeholder for Charlie's API to be called



});

    

