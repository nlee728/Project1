console.log("in");
$('#submit-btn').on("click",function(event){

        // Preventing the buttons default behavior when clicked (which is submitting a form)
        event.preventDefault();
    
    
    // Capture zipcode
        var zipcode = $("#zipcode-input").val();

    // GRoup should be captured
        var group = $("#group-input").val();

        // Check the zipcode
        zipValid(zipcode);

    //Check if Group already exists
        groupCheck(group);



});

// Functions "hoisted" here

function zipValid(zipcode){

    regexZip=new RegExp('/^[0-9]{5}$/');

    if (zipcode === "") {

        alert("Enter a zip");
    
    } else if (regexZip.test(zipcode)==true) {

        alert("Do not enter any non number characters");

    } else if (zipcode.length < 5) {

        alert("Zip should be 5 digits (4 digit ZIP4s are not needed ) ");

    } else return;
};

function groupCheck(group){
    var groups=['Hyatt House Hyenas','Morrisville Morons','Raleigh Rascals','Macaroni Cheese Pizza'];

    if (groups.indexOf(group)==true) {
        return;
    } else {
        $(".card-body").append("Group does not exist - Click add to create the same.",{id:"add-note"})
                        .append($("<p>"))
                        .append($("<button>",{text:"Add group",class:"btn-primary",id:"add-group"}));
        
        $("#add-group").on("click",function(event){
            groups.push(group);
            $("#add-note").empty();
            console.log(groups);
        });

    } ;
};

