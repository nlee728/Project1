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
//database Ref for an individual group's movies folder in firebase
var singleGroupRef = database.ref('/groups/TestGroup/movies');

<<<<<<< HEAD
//moviesRef.set({movies: movieChoice});
//usersRef.set({users: userName});


// SS - wrapping this up in a callMovieAPI function that will be called once the group and zipcode is created.

function callMovieAPI(zipcode){

  var startDate = moment().format("YYYY-MM-DD");
  var api_key = 'seehjrjvumeesg8pe3e87j9j';
  var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
=======
var startDate = '2018-07-26';
var zipcode = '27615';
var api_key = 'seehjrjvumeesg8pe3e87j9j';
var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
>>>>>>> ec759173e6994cd30bf59e472be2acaf33a14151
        'startDate=' + startDate +
        '&zip=' + zipcode +
        '&api_key=' + api_key;

   
  $.get(url).then(function(response) {
    console.log(response);
    var data = response;
    generateMovies(data);
  });

};

<<<<<<< HEAD
=======
//push api data to firebase, commented out to reduce api calls on page load. just un-comment to test.
/*           $.get(url).then(function(response) {
            getMovieData(response);
          });  */

//display logic for movie data from firebase
singleGroupRef.on('child_added', function(snapshot) {
  console.log(snapshot.val())
  generateMovies(snapshot.val());
});
>>>>>>> ec759173e6994cd30bf59e472be2acaf33a14151

$("#submit-btn").on("click",function(e) {   
  e.preventDefault();
  var groupName = $('#add-group-input').val().trim();
  console.log(groupName);
  var zipcode = $('#zipcode-input').val().trim();
  
  var groupsRef = database.ref('/groups/' + groupName);
  console.log(groupsRef)
  groupsRef.set({movie: 'jaws',
                 zipcode});
});

<<<<<<< HEAD
// SS - suggestion - moving this to main . js for now - to keep all functions together

// function generateMovies(data) {
//   for(let movie of data) {
//       var tr =  $('<tr>');
//       var th = $('<th>');
//       $('#movie-table').append(tr);
//       tr.append(th).text(movie.title);
//       tr.append(th).text(movie.topCase);
//       tr.append(th).text(movie.officialUrl);
//       tr.append(th).text(movie.showtimes);
//   }
// }
=======



function generateMovies(data) {
      var tr =  $('<tr>');
      $('#movie-table').append(tr);
      tr.append(`<th>${data.title}</th>`);
      tr.append(`<th>${data.genre}</th>`);
      tr.append(`<th>${data.runTime}min</th>`);
      tr.append(`<th>${data.rating}</th>`);
      tr.append(`<th><a href="${data.trailer}" target="_blank">Trailer</a></th>`);
      tr.append(`<th><input class="form-control" id="rank-input" placeholder="1-5" type="text"></th>`);
}
>>>>>>> ec759173e6994cd30bf59e472be2acaf33a14151

function getMovieData(data) {
  var fiveMovies = []
  console.log(fiveMovies);
  for(let i = 0; i <= 5; i++) {
      var runTime = parseRunTime(data[i].runTime);
      fiveMovies.push({title: data[i].title, 
                      genre: data[i].genres[0],
                      runTime: runTime,
                      rating: data[i].ratings[0].code,
                      trailer: data[i].officialUrl
                      });
  }                    
  var groupName = 'TestGroup'
  var zipcode = '27615'
  var groupsRef = database.ref('/groups/' + groupName);
  groupsRef.set({movies: fiveMovies,
                 zipcode});
}

//turn runTime format(ISO) to something readable
function parseRunTime(runTime) {
  var hours = parseInt(runTime.slice(3, runTime.length - 4));
  var minutes = parseInt(runTime.slice(5, runTime.length - 1));
  var formatedRunTime = (hours * 60) + minutes;
  return formatedRunTime;
}
