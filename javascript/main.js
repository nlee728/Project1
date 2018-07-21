console.log("in");
$('#submit-btn').on("click",function(event){

        // Preventing the buttons default behavior when clicked (which is submitting a form)
        event.preventDefault();
    
    
    // Capture zipcode
        var zipcode = $("#zipcode-input").val();

    // GRoup should be captured
        var group = $("#group-input").val();

        var zc=false;

        do while(zc=false) {
                    // Check the zipcode
                    zipValid(zc,zipcode);
           
        } ;

        //Check if Group already exists
         groupCheck(group);



    



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
        return zc=false;

    } else if (zipcode.length < 5) {

        alert("Zip should be 5 digits (4 digit ZIP4s are not needed ) ");

    } else return zc=true;
};

function groupCheck(group){
    var groups=['Hyatt House Hyenas','Morrisville Morons','Raleigh Rascals','Macaroni Cheese Pizza'];


    if (groups.indexOf(group)==true) {
        return;
    } else {
        $(".card-body").append("Group does not exist - Click add to create the same.",{id:"add-note"})
                        .append($("<p>"))
                        .append($("<button>",{text:"Add group",class:"btn-primary",id:"add-group"}))
                        .append($("<button>",{text:"Forget it",class:"btn-danger",id:"no-group"}));
        
        
        $("#add-group").on("click",function(event){
            groups.push(group);
            $(this).text="";
            console.log(groups);
           });

    } ;
};

