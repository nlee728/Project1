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
        
        $("#find-group").append($("<p>",{id:"login-conf1",text:"Group found."}));
        $("#find-group").append($("<p>",{id:"login-conf2",text:"You are now logged in!"}));
        $("#group-input").val("Logged In");
        $("#login-btn").text("Logged In");
        $("#login-btn").css({"background-color":"green"});
        return gc;
        ;
    } else {
        $("#login-conf1").empty();
        $("#login-conf2").empty();
        $("#find-group").append($("<p>",{id:"login-conf1",text:"Group does not exist "}))
                        .append($("<p>",{id:"login-conf2",text:"Click Add to create the same."}));
        $("#add-group-input").val(group);
        $("#login-btn").text("--->");
        $("#group-input").val("Not Found");

                        // .append($("<button>",{text:"Ok",class:"btn-primary",id:"ok-group"}));     
        return gc;
    } ;
};


// EVENT HANDLERS

// EH Number 1
// Whenever the groups in Firebase Changes - this updates a local copy so that people (and the JS program) know which groups are there

// Note to John / team - please let me know if this firebase table name needs to change

database.ref("GroupsList").on("value", function(snapshot) {
    
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
            database.ref("GroupsList").push(groupArray);
            writeLogin(group);
            $("#add-group").append($("<p>",{id:"already-there-note",text:"Group added - login <---"}));
            $("#group-input").val(group);
            $("#submit-button").text("Add another Group ");
        } else {
            console.log("already there");
            $("#add-group").append($("<p>",{id:"already-there-note",text:"Group already exists - no need to add"}));
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
