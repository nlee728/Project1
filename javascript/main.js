console.log("in");

// Temp list of groups here - in future - these will come from firebase
var groups=['Hyatt House Hyenas','Morrisville Morons','Raleigh Rascals','Macaroni Cheese Pizza'];


$("#login-btn").on("click",function(event){


    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();
    

    // GRoup should be captured
    var group = $("#group-input").val();

    //Check if Group already exists
    var gc=false;
    do{ 
        gc=groupCheck(gc,group);
        console.log("checking");
        
    } while(gc === false);

});

$('#submit-btn').on("click",function(event){

        // Preventing the buttons default behavior when clicked (which is submitting a form)
        event.preventDefault();
    
    
    // Capture zipcode
        var zipcode = $("#zipcode-input").val();


        var zc=false;

        do {
                    // Check the zipcode
                    zc=zipValid(zc,zipcode);
           
        } while(zc === false) ;




    



});

// Functions "hoisted" here

function zipValid(zc,zipcode){

    regexZip=new RegExp('/^[0-9]{5}$/');

    zipcode = zipcode.replace(/\D/,'');

    if (zipcode === "") {

        alert("Enter a zip");
        return zc;
    
    } else if (regexZip.test(zipcode)==true) {

        alert("Do not enter any non number characters");
        return zc ;

    } else if (zipcode.length < 5) {

        alert("Zip should be 5 digits (4 digit ZIP4s are not needed ) ");

    } else {
        zc=true;
        return zc;
    };
};

function groupCheck(gc,group){

    $("#add-group").remove();
    $("#no-group").remove();
    $("#add-note").remove();

    if (groups.indexOf(group)==true) {
        gc=true;
        return gc;
    } else {
        $(".card-body").append($("Group does not exist - Click add to create the same.",{id:"add-note"}))
                        .append($("<p>"))
                        .append($("<button>",{text:"Add group",class:"btn-primary",id:"add-group"}))
                        .append($("<button>",{text:"Forget it",class:"btn-danger",id:"no-group"}));
        
        gc=true;
        return gc;
        
        
        
    } ;
};

$("#add-group").on("click",function(event){

    $("#no-group").remove();
    groups.push(group);
    $(this).text="";
    console.log(groups);

});
