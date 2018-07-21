

console.log("in");

//Grab values from all elements

var submit=$("#submit-btn").text();

var suggestions = $("#movie-table");


// console.log(submit);
// console.log(suggestions);

$("#submit-btn").on("click",function(event){

    // Preventing the buttons default behavior when clicked (which is submitting a form)
    event.preventDefault();

        var zipcode = $("#zipcode-input").text();
        console.log("You clicked "+zipcode);

        if (zipcode===""){
            alert("No Zipcode entered!");
        } else if (zipcode.length<5){
            alert("Zipcode not valid - please enter 5 digit zipcode and 4 digits Zip4 (optional)");
        };


});