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

//moviesRef.set({movies: movieChoice});
//usersRef.set({users: userName});

var startDate = '2018-07-24';
var zipcode = '27615';
var api_key = 'seehjrjvumeesg8pe3e87j9j';
var url = 'http://data.tmsapi.com/v1.1/movies/showings?' +
        'startDate=' + startDate +
        '&zip=' + zipcode +
        '&api_key=' + api_key

console.log(url)

$.get(url).then(function(response) {
  console.log(response);
  var data = response;
  generateMovies(data);
});

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

function generateMovies(data) {
  for(let movie of data) {
      var tr =  $('<tr>');
      var th = $('<th>');
      $('#movie-table').append(tr);
      tr.append(th).text(movie.title);
      tr.append(th).text(movie.topCase);
      tr.append(th).text(movie.officialUrl);
      tr.append(th).text(movie.showtimes);
  }
}

function getMovieData(data) {
  var fiveMovies = []
  for(let i = 0; i <= 5; i++) {
      fiveMovies.push(data[i].title);
  }
}
