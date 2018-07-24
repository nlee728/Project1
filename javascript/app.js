console.log('hello world')

// Initialize Firebase
const config = {
    apiKey: "AIzaSyCwQB5i43m4j4WfQ-XsyqggSLRZVLUtwSI",
    authDomain: "pickaflick-c5ed5.firebaseapp.com",
    databaseURL: "https://pickaflick-c5ed5.firebaseio.com",
    projectId: "pickaflick-c5ed5",
    storageBucket: "pickaflick-c5ed5.appspot.com",
    messagingSenderId: "440737258675"
};
firebase.initializeApp(config);

database = firebase.database();

// var moviesRef = database.ref('/movies');
// var usersRef = database.ref('/users');

// SS  - I am commenting this for now

// var zipcode = $('#zipcode-input').val().trim();
// var group = $('#group-input').val().trim();

//moviesRef.set({movies: movieChoice});
//usersRef.set({users: userName});

// SS - suggestion - add moment to get the date - this can be shifted to the main.js

var startDate = moment().format("DD/MMM/YYYY HH:mm");

// SS - Suggestion - I am commenting this since zipcode will be taken from the html  
// var zipcode = '27560';

var api_key = 'seehjrjvumeesg8pe3e87j9j';
var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
          'startDate=' + startDate +
          '&zip=' + zipcode +
          '&api_key=' + api_key
